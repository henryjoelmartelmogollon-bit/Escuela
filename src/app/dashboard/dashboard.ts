import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CURSOS, EstudiantesService, NOTA_MINIMA } from '../servicios/estudiantes.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  private servicio = inject(EstudiantesService);

  total = computed(() => this.servicio.estudiantes().length);

  promedio = computed(() => {
    const lista = this.servicio.estudiantes();
    if (lista.length === 0) {
      return 0;
    }
    return lista.reduce((suma, e) => suma + e.nota, 0) / lista.length;
  });

  aprobados = computed(() => this.servicio.estudiantes().filter((e) => e.nota >= NOTA_MINIMA).length);

  desaprobados = computed(() => this.total() - this.aprobados());

  mejor = computed(() => {
    const lista = this.servicio.estudiantes();
    return lista.length === 0 ? null : lista.reduce((a, b) => (b.nota > a.nota ? b : a));
  });

  porCurso = computed(() =>
    CURSOS.map((curso) => ({
      curso,
      cantidad: this.servicio.estudiantes().filter((e) => e.curso === curso).length
    }))
  );

  porcentaje(cantidad: number): number {
    return this.total() === 0 ? 0 : (cantidad / this.total()) * 100;
  }
}
