import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CURSOS, Estudiante, EstudiantesService } from '../../servicios/estudiantes.service';

@Component({
  selector: 'app-estudiante-form-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './estudiante-form-dialog.html',
  styleUrl: './estudiante-form-dialog.css'
})
export class EstudianteFormDialog {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<EstudianteFormDialog>);
  private servicio = inject(EstudiantesService);

  estudiante = inject<Estudiante | null>(MAT_DIALOG_DATA);
  titulo = this.estudiante ? 'Editar estudiante' : 'Nuevo estudiante';
  cursos = CURSOS;

  formulario = this.fb.group({
    nombre: this.fb.nonNullable.control(this.estudiante?.nombre ?? '', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(60),
      (control: AbstractControl): ValidationErrors | null =>
        this.servicio.nombreUsado(control.value ?? '', this.estudiante?.id ?? null) ? { repetido: true } : null
    ]),
    curso: this.fb.nonNullable.control(this.estudiante?.curso ?? CURSOS[0], [Validators.required]),
    nota: this.fb.control<number | null>(this.estudiante?.nota ?? null, [
      Validators.required,
      Validators.min(0),
      Validators.max(20)
    ])
  });

  guardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    const valores = this.formulario.getRawValue();
    this.dialogRef.close({
      nombre: valores.nombre.trim(),
      curso: valores.curso,
      nota: Number(valores.nota)
    });
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}
