// src/app/shared/components/bovine-event-modal/bovine-event-modal.component.ts
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
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import {
  BovineEvent,
  CreateBovineEvent,
  UpdateBovineEvent,
} from '@shared/models/bovine-event.model';

@Component({
  selector: 'app-bovine-event-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './bovine-event-modal.component.html',
})
export class BovineEventModalComponent implements OnChanges {
  /** Controla visibilidad */
  @Input() open = false;
  /** Evento a editar; null => crear */
  @Input() event: BovineEvent | null = null;
  /** ID del bovino para creación */
  @Input() bovineId!: number;

  /** Cerrar sin guardar */
  @Output() closed = new EventEmitter<void>();
  /**
   * Emitir payload:
   * - creación: { data: CreateBovineEvent }
   * - edición:  { id, data: UpdateBovineEvent }
   */
  @Output()
  saved = new EventEmitter<
    { data: CreateBovineEvent } | { id: number; data: UpdateBovineEvent }
  >();

  form = new FormGroup({
    event_date: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    event_category: new FormControl<'Health' | 'Reproduction'>('Health', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    event_type: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100)],
    }),
    severity: new FormControl<'Mild' | 'Moderate' | 'Severe' | ''>('', {
      nonNullable: true,
    }),
    result: new FormControl<'Positive' | 'Negative' | 'Unknown' | ''>('', {
      nonNullable: true,
    }),
    lactation_affected: new FormControl<boolean>(false, {
      nonNullable: true,
    }),
    notes: new FormControl<string>('', {
      nonNullable: true,
    }),
  });

  ngOnChanges(changes: SimpleChanges) {
    if (changes['event']) {
      if (this.event) {
        // Editar: convertir UTC a local para el input datetime-local
        const d = new Date(this.event.event_date);
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        const local = d.toISOString().slice(0, 16);

        this.form.reset({
          event_date: local,
          event_category: this.event.event_category,
          event_type: this.event.event_type,
          severity: this.event.severity ?? '',
          result: this.event.result ?? '',
          lactation_affected: this.event.lactation_affected,
          notes: this.event.notes ?? '',
        });
      } else {
        // Crear: inicializar con hora local actual
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        this.form.reset({
          event_date: now.toISOString().slice(0, 16),
          event_category: 'Health',
          event_type: '',
          severity: '',
          result: '',
          lactation_affected: false,
          notes: '',
        });
      }
    }
  }

  onClose() {
    this.closed.emit();
  }

  onSubmit() {
    if (this.form.invalid) return;

    // Como usamos nonNullable, getRawValue() nos devuelve las propiedades sin undefined
    const raw = this.form.getRawValue();
    const isoDate = new Date(raw.event_date).toISOString();

    if (this.event) {
      // Edición: construimos UpdateBovineEvent (sin bovine_id ni event_id)
      const payload: UpdateBovineEvent = {
        event_date: isoDate,
        event_category: raw.event_category,
        event_type: raw.event_type,
        severity: raw.severity || undefined,
        result: raw.result || undefined,
        lactation_affected: raw.lactation_affected,
        notes: raw.notes || undefined,
      };
      this.saved.emit({ id: this.event.event_id, data: payload });
    } else {
      // Creación: construimos CreateBovineEvent (incluye bovine_id)
      const payload: CreateBovineEvent = {
        bovine_id: this.bovineId,
        event_date: isoDate,
        event_category: raw.event_category,
        event_type: raw.event_type,
        severity: raw.severity || undefined,
        result: raw.result || undefined,
        lactation_affected: raw.lactation_affected,
        notes: raw.notes || undefined,
      };
      this.saved.emit({ data: payload });
    }
  }
}
