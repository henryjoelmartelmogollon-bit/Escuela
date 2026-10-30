import { Component, computed, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AuthService } from '../servicios/auth.service';
import { ConfirmarDialog } from '../compartido/confirmar-dialog/confirmar-dialog';
import { EstudianteFormDialog } from './estudiante-form-dialog/estudiante-form-dialog';
import { CURSOS, Estudiante, EstudiantesService, NOTA_MINIMA } from '../servicios/estudiantes.service';

@Component({
  selector: 'app-estudiantes',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressBarModule
  ],
  templateUrl: './estudiantes.html',
  styleUrl: './estudiantes.css'
})
export class Estudiantes {
  private servicio = inject(EstudiantesService);
  private auth = inject(AuthService);
  private dialog = inject(MatDialog);

  cursos = CURSOS;
  notaMinima = NOTA_MINIMA;
  esAdmin = this.auth.esAdmin();
  esEstudiante = this.auth.esEstudiante();
  nombreSesion = this.auth.obtenerNombre();
  columnas = this.esAdmin
    ? ['id', 'nombre', 'curso', 'nota', 'estado', 'acciones']
    : ['id', 'nombre', 'curso', 'nota', 'estado'];

  busqueda = signal('');
  cursoFiltro = signal('');
  pagina = signal(0);
  tamano = signal(5);

  disponibles = computed(() =>
    this.esEstudiante
      ? this.servicio.estudiantes().filter((e) => e.nombre === this.nombreSesion)
      : this.servicio.estudiantes()
  );

  total = computed(() => this.disponibles().length);

  filtrados = computed(() => {
    const texto = this.busqueda().trim().toLowerCase();
    const curso = this.cursoFiltro();
    return this.disponibles().filter((e) => e.nombre.toLowerCase().includes(texto) && (curso === '' || e.curso === curso));
  });

  cargando = signal(true);

  constructor() {
    setTimeout(() => this.cargando.set(false), 300);
  }

  orden = signal<Sort>({ active: '', direction: '' });

  ordenados = computed(() => {
    const { active, direction } = this.orden();
    const lista = [...this.filtrados()];
    if (!active || direction === '') {
      return lista;
    }
    const campo = (active === 'estado' ? 'nota' : active) as keyof Estudiante;
    return lista.sort((a, b) => {
      const x = a[campo];
      const y = b[campo];
      const resultado = typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y));
      return direction === 'asc' ? resultado : -resultado;
    });
  });

  visibles = computed(() => {
    const inicio = this.pagina() * this.tamano();
    return this.ordenados().slice(inicio, inicio + this.tamano());
  });

  buscar(evento: Event): void {
    this.busqueda.set((evento.target as HTMLInputElement).value);
    this.pagina.set(0);
  }

  filtrarCurso(curso: string): void {
    this.cursoFiltro.set(curso);
    this.pagina.set(0);
  }

  limpiarFiltros(): void {
    this.busqueda.set('');
    this.cursoFiltro.set('');
    this.pagina.set(0);
  }

  cambiarOrden(orden: Sort): void {
    this.orden.set(orden);
    this.pagina.set(0);
  }

  cambiarPagina(evento: PageEvent): void {
    this.pagina.set(evento.pageIndex);
    this.tamano.set(evento.pageSize);
  }

  abrirFormulario(estudiante?: Estudiante): void {
    const ref = this.dialog.open(EstudianteFormDialog, { width: '420px', data: estudiante ?? null });
    ref.afterClosed().subscribe((datos: Omit<Estudiante, 'id'> | undefined) => {
      if (datos) {
        this.servicio.guardar(datos, estudiante?.id ?? null);
      }
    });
  }

  borrar(estudiante: Estudiante): void {
    const ref = this.dialog.open(ConfirmarDialog);
    ref.afterClosed().subscribe((confirmado: boolean | undefined) => {
      if (!confirmado) {
        return;
      }
      this.servicio.borrar(estudiante.id);
      if (this.visibles().length === 0 && this.pagina() > 0) {
        this.pagina.update((p) => p - 1);
      }
    });
  }
}
