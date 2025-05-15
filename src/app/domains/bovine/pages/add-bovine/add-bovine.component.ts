// pages/add-bovine/add-bovine.component.ts
import { Component, inject, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import type { CreateBovine } from '@shared/models/bovine.model';
import { BovineService } from '@shared/services/bovine.service';

@Component({
  selector: 'app-add-bovine',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-bovine.component.html',
})
export default class AddBovineComponent implements OnInit {
  private bovineService = inject(BovineService);
  private router = inject(Router);

  form = new FormGroup({
    ear_tag: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    breed: new FormControl<'Holstein' | 'Ayrshire' | 'Jersey'>('Holstein', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    date_of_birth: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    weight_kg: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),
    sex: new FormControl<'Male' | 'Female'>('Female', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    lactation_stage: new FormControl<number>(1, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0), Validators.max(5)],
    }),
    is_active: new FormControl<boolean>(true, {
      nonNullable: true,
    }),
  });

  get f() {
    return this.form.controls;
  }

  ngOnInit() {
    // Cuando sexo cambie:
    this.f.sex.valueChanges.subscribe((sex) => {
      if (sex === 'Male') {
        // asigna 0 y deshabilita el control
        this.f.lactation_stage.setValue(0, { emitEvent: false });
        this.f.lactation_stage.disable({ emitEvent: false });
      } else {
        // restablece y habilita
        this.f.lactation_stage.enable({ emitEvent: false });
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    // getRawValue incluye valores de controles deshabilitados
    const vals = this.form.getRawValue();

    const payload: CreateBovine = {
      ear_tag: vals.ear_tag,
      breed: vals.breed,
      date_of_birth: vals.date_of_birth,
      weight_kg: vals.weight_kg,
      sex: vals.sex,
      lactation_stage: vals.lactation_stage, // ya es 0 si es Male
      is_active: vals.is_active,
    };

    this.bovineService.createBovine(payload).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => console.error('Error al crear bovino', err),
    });
  }
}
