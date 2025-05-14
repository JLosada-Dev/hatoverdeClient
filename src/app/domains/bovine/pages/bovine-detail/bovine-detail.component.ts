// pages/bovine-detail/bovine-detail.component.ts

import {
  Component,
  Input,
  OnInit,
  inject,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { Bovine, CreateBovine } from '@shared/models/bovine.model';
import {
  MilkProduction,
  CreateMilkProduction,
  UpdateMilkProduction,
} from '@shared/models/milk-production.model';
import { BovineEvent } from '@shared/models/bovine-event.model';

import { BovineService } from '@shared/services/bovine.service';
import { MilkProductionService } from '@shared/services/milk-production.service';
import { BovineEventService } from '@shared/services/bovine-event.service';

import { BovineEditModalComponent } from '@shared/components/bovine-edit-modal/bovine-edit-modal.component';
import { MilkProductionModalComponent } from '@shared/components/milk-production-modal/milk-production-modal.component';

@Component({
  selector: 'app-bovine-detail',
  standalone: true,
  imports: [
    CommonModule,
    BovineEditModalComponent,
    MilkProductionModalComponent,
  ],
  templateUrl: './bovine-detail.component.html',
  styleUrls: ['./bovine-detail.component.css'],
})
export default class BovineDetailComponent implements OnInit {
  /** Input: bovine ID from parent */
  @Input({ required: true }) id!: string;

  /** Señales de datos */
  bovine = signal<Bovine | null>(null);
  productions = signal<MilkProduction[]>([]);
  eventBovine = signal<BovineEvent[]>([]);

  /** Paginación */
  pageIndex = signal(0);
  pageSize = signal(5);
  paginatedProductions = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.productions().slice(start, start + this.pageSize());
  });
  totalPages = computed(() =>
    Math.ceil(this.productions().length / this.pageSize()),
  );

  /** Modales de edición */
  isEditOpen = signal(false); // para editar bovino
  isAddProdOpen = signal(false); // para crear producción
  isEditProdOpen = signal(false); // para editar producción
  selectedProd = signal<MilkProduction | null>(null);

  private bovineSvc = inject(BovineService);
  private productionSvc = inject(MilkProductionService);
  private eventSvc = inject(BovineEventService);

  ngOnInit() {
    this.loadBovine();
  }

  private loadBovine() {
    this.bovineSvc.getBovineById(this.id).subscribe({
      next: (b) => {
        this.bovine.set(b);
        this.loadProductions(b.bovine_id);
        this.loadEvents(b.bovine_id);
      },
      error: (err) => console.error(err),
    });
  }

  private loadProductions(bovineId: number) {
    this.productionSvc.getAllMilkProduction().subscribe({
      next: (all) =>
        this.productions.set(all.filter((p) => p.bovine_id === bovineId)),
      error: (err) => console.error(err),
    });
  }

  private loadEvents(bovineId: number) {
    this.eventSvc.getAllBovineEvent().subscribe({
      next: (all) =>
        this.eventBovine.set(all.filter((e) => e.bovine_id === bovineId)),
      error: (err) => console.error(err),
    });
  }

  /** Editar bovino */
  onEditBovine() {
    this.isEditOpen.set(true);
  }
  onSaveEdit(payload: CreateBovine) {
    if (!this.bovine()) return;
    this.bovineSvc
      .updateBovine(this.bovine()!.bovine_id, payload)
      .subscribe((updated) => {
        this.bovine.set(updated);
        this.isEditOpen.set(false);
      });
  }

  /** Producciones: apertura de modales */
  onAddProduction() {
    this.selectedProd.set(null);
    this.isAddProdOpen.set(true);
  }

  onEditProduction(prod: MilkProduction) {
    this.selectedProd.set(prod);
    this.isEditProdOpen.set(true);
  }

  onSaveProduction(event: {
    id?: number;
    data: CreateMilkProduction | UpdateMilkProduction;
  }) {
    const { id, data } = event;
    const call$ = id
      ? this.productionSvc.updateMilkProduction(id, data) // data es UpdateMilkProduction
      : this.productionSvc.createMilkProduction(data as CreateMilkProduction); // data es CreateMilkProduction

    call$.subscribe({
      next: () => {
        this.loadProductions(this.bovine()!.bovine_id);
        this.isAddProdOpen.set(false);
        this.isEditProdOpen.set(false);
      },
      error: (err) => console.error('Error guardando producción:', err),
    });
  }

  /** Eventos: (igual que antes) */
  onAddEvent() {
    console.log('Agregar evento', this.id);
  }
  onEditEvent(e: BovineEvent) {
    console.log('Editar evento', e.event_id);
  }

  /** Paginación */
  prevPage() {
    if (this.pageIndex() > 0) this.pageIndex.update((i) => i - 1);
  }
  nextPage() {
    if (this.pageIndex() < this.totalPages() - 1)
      this.pageIndex.update((i) => i + 1);
  }
}
