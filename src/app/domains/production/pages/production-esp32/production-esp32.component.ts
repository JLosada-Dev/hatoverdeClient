import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  WritableSignal,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Esp32Service } from '@shared/services/esp32.service';
import { MilkProductionService } from '@shared/services/milk-production.service';
import { BovineService } from '@shared/services/bovine.service';
import {
  Esp32Error,
  PendingProduction,
  Esp32Config,
} from '@shared/models/esp32.model';
import { EarTag } from '@shared/models/bovine.model';
import { MilkProductionWithBovine } from '@shared/models/production.model';

@Component({
  selector: 'app-production-esp32',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './production-esp32.component.html',
})
export default class ProductionEsp32Component implements OnInit, OnDestroy {
  private esp32 = inject(Esp32Service);
  private milkProd = inject(MilkProductionService);
  private bovineSvc = inject(BovineService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  /** Producciones recibidas por SSE */
  productions = signal<MilkProductionWithBovine[]>([]);
  private prodSource!: EventSource;

  configForm = this.fb.group({
    bovine_id: [0, Validators.required],
    milk_fat: [0, [Validators.required, Validators.min(0)]],
    milk_protein: [0, [Validators.required, Validators.min(0)]],
  });

  earTags: EarTag[] = [];

  lastError: WritableSignal<Esp32Error | null> = signal(null);
  pending: WritableSignal<PendingProduction | null> = signal(null);

  private pollSub!: Subscription;
  private errSource!: EventSource;

  ngOnInit() {
    // Cargar bovinos activos
    this.bovineSvc.listActiveEarTags().subscribe({
      next: (list) => (this.earTags = list),
      error: (e) => console.error('EarTags load failed', e),
    });

    // Escuchar errores SSE
    this.errSource = this.esp32.getEsp32ErrorStream();
    this.errSource.onmessage = (evt) =>
      this.lastError.set(JSON.parse(evt.data));
    this.errSource.onerror = (e) => {
      console.error('Error stream errores desconectado', e);
      this.errSource.close();
      setTimeout(() => this.reconnectErrorStream(), 5000);
    };

    // Polling para producciones pendientes
    this.pollSub = interval(3000)
      .pipe(switchMap(() => this.esp32.getPendingProduction()))
      .subscribe({
        next: (p) => this.pending.set(p),
        error: (e) => console.error('Pending failed', e),
      });

    // Escuchar producciones en tiempo real
    this.prodSource = this.esp32.getProductionStream();
    this.prodSource.onmessage = (evt) => {
      const prod: MilkProductionWithBovine = JSON.parse(evt.data);
      this.productions.update((curr) => {
        const newList = [...curr, prod];
        return newList.length > 20 ? newList.slice(-20) : newList;
      });
    };
    this.prodSource.onerror = (e) => {
      console.error('Error stream productions desconectado', e);
      this.prodSource.close();
      setTimeout(() => this.reconnectProductionStream(), 5000);
    };
  }

  reconnectErrorStream() {
    console.log('Intentando reconectar al stream de errores...');
    this.errSource = this.esp32.getEsp32ErrorStream();
    this.errSource.onmessage = (evt) =>
      this.lastError.set(JSON.parse(evt.data));
    this.errSource.onerror = (e) => {
      console.error('Error stream errores desconectado durante reconexión', e);
      this.errSource.close();
      setTimeout(() => this.reconnectErrorStream(), 5000);
    };
  }

  reconnectProductionStream() {
    console.log('Intentando reconectar al stream de producciones...');
    this.prodSource = this.esp32.getProductionStream();
    this.prodSource.onmessage = (evt) => {
      const prod: MilkProductionWithBovine = JSON.parse(evt.data);
      this.productions.update((curr) => {
        const newList = [...curr, prod];
        return newList.length > 20 ? newList.slice(-20) : newList;
      });
    };
    this.prodSource.onerror = (e) => {
      console.error(
        'Error stream productions desconectado durante reconexión',
        e,
      );
      this.prodSource.close();
      setTimeout(() => this.reconnectProductionStream(), 5000);
    };
  }

  ngOnDestroy() {
    this.pollSub.unsubscribe();
    this.errSource.close();
    this.prodSource.close();
  }

  enviarConfiguracion() {
    if (this.configForm.invalid) return;

    const raw = this.configForm.value;
    const cfg: Esp32Config = {
      bovine_id: Number(raw.bovine_id),
      milk_fat: raw.milk_fat!,
      milk_protein: raw.milk_protein!,
    };

    console.log('Enviando configuración al ESP32:', cfg);
    this.esp32.enviarConfigAlEsp32(cfg).subscribe({
      next: () => console.log('Configuración enviada'),
      error: (e) => console.error('ESP32 config error', e),
    });
  }

  confirmarProduccion() {
    const p = this.pending();
    if (!p) return;
    this.milkProd
      .createMilkProduction({
        bovine_id: p.bovine_id,
        milk_yield: p.milk_yield,
        milk_fat: p.milk_fat,
        milk_protein: p.milk_protein,
        milking_time: new Date(p.timestamp).toISOString(),
      })
      .subscribe({
        next: () =>
          this.esp32.clearPending().subscribe(() => this.pending.set(null)),
        error: (e) => console.error('Guardar producción falló', e),
      });
  }

  rechazarProduccion() {
    this.esp32.clearPending().subscribe(() => this.pending.set(null));
  }

  verTodasLasProducciones() {
    this.router.navigate(['/producciones']);
  }
}
