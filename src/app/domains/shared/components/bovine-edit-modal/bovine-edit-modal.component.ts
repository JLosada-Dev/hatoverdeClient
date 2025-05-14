import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Bovine, CreateBovine } from '@shared/models/bovine.model';

@Component({
  selector: 'app-bovine-edit-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './bovine-edit-modal.component.html',
  styleUrls: ['./bovine-edit-modal.component.css'],
})
export class BovineEditModalComponent implements OnChanges {
  @Input() bovine!: Bovine;
  @Input() open = false;

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<CreateBovine>();

  form = new FormGroup({
    ear_tag: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    breed: new FormControl<'Holstein' | 'Ayrshire' | 'Jersey'>('Holstein', {
      nonNullable: true,
    }),
    date_of_birth: new FormControl<string>('', { nonNullable: true }),
    weight_kg: new FormControl<number>(0, { nonNullable: true }),
    sex: new FormControl<'Male' | 'Female'>('Female', { nonNullable: true }),
    lactation_stage: new FormControl<number>(1, { nonNullable: true }),
    is_active: new FormControl<boolean>(true, { nonNullable: true }),
  });

  ngOnChanges(changes: SimpleChanges) {
    if (changes['bovine'] && this.bovine) {
      this.form.reset({
        ear_tag: this.bovine.ear_tag,
        breed: this.bovine.breed,
        date_of_birth: this.bovine.date_of_birth,
        weight_kg: this.bovine.weight_kg,
        sex: this.bovine.sex,
        lactation_stage: this.bovine.lactation_stage,
        is_active: this.bovine.is_active,
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.saved.emit(this.form.value as CreateBovine);
  }
}
