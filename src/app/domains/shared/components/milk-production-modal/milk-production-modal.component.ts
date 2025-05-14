import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MilkProduction,
  CreateMilkProduction,
  UpdateMilkProduction,
} from '@shared/models/milk-production.model';

@Component({
  selector: 'app-milk-production-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './milk-production-modal.component.html',
  styleUrls: ['./milk-production-modal.component.css'],
})
export class MilkProductionModalComponent implements OnChanges {
  @Input() open = false;
  @Input() production: MilkProduction | null = null;
  @Input() bovineId!: number;

  /**
   * Emitimos { id?, data }
   * - para crear: id = undefined, data incluye bovine_id
   * - para editar: id = production_id, data SIN bovine_id
   */
  @Output() closed = new EventEmitter<void>();
  @Output()
  saved = new EventEmitter<{
    id?: number;
    data: CreateMilkProduction | UpdateMilkProduction;
  }>();

  form = new FormGroup({
    milking_time: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    milk_yield: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),
    milk_fat: new FormControl<number | null>(null),
    milk_protein: new FormControl<number | null>(null),
  });

  ngOnChanges(changes: SimpleChanges) {
    if (changes['production']) {
      if (this.production) {
        // Convertir UTC → hora local (ISO sin segundos)
        const utc = new Date(this.production.milking_time);
        utc.setMinutes(utc.getMinutes() - utc.getTimezoneOffset());
        const localStr = utc.toISOString().slice(0, 16);

        this.form.reset({
          milking_time: localStr,
          milk_yield: this.production.milk_yield,
          milk_fat: this.production.milk_fat ?? null,
          milk_protein: this.production.milk_protein ?? null,
        });
      } else {
        // Nuevo registro: usar ahora en hora local
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        this.form.reset({
          milking_time: now.toISOString().slice(0, 16),
          milk_yield: 0,
          milk_fat: null,
          milk_protein: null,
        });
      }
    }
  }

  onSubmit() {
    if (this.form.invalid) return;

    // 1) Leer directamente desde los FormControls (su valor es estrictamente string/number)
    const milking_time = this.form.controls.milking_time.value;
    const milk_yield = this.form.controls.milk_yield.value;
    const milk_fat = this.form.controls.milk_fat.value;
    const milk_protein = this.form.controls.milk_protein.value;

    if (this.production) {
      // === EDITAR ===
      const data: UpdateMilkProduction = {
        milking_time,
        milk_yield,
        ...(milk_fat != null && { milk_fat }),
        ...(milk_protein != null && { milk_protein }),
      };
      this.saved.emit({ id: this.production.production_id, data });
    } else {
      // === CREAR ===
      const data: CreateMilkProduction = {
        bovine_id: this.bovineId,
        milking_time,
        milk_yield,
        ...(milk_fat != null && { milk_fat }),
        ...(milk_protein != null && { milk_protein }),
      };
      this.saved.emit({ data });
    }
  }

  onClose() {
    this.closed.emit();
  }
}
