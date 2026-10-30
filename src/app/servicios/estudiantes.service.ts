import { Injectable, signal } from '@angular/core';

export interface Estudiante {
  id: number;
  nombre: string;
  curso: string;
  nota: number;
}

export const CURSOS = ['Matemática', 'Comunicación', 'Historia', 'Ciencias', 'Inglés'];

export const NOTA_MINIMA = 11;

const CLAVE = 'estudiantesEscuela';

const INICIALES: Estudiante[] = [
  { id: 1, nombre: 'Ana Torres', curso: 'Matemática', nota: 18 },
  { id: 2, nombre: 'Luis Pérez', curso: 'Matemática', nota: 9 },
  { id: 3, nombre: 'María Rojas', curso: 'Comunicación', nota: 15 },
  { id: 4, nombre: 'Carlos Díaz', curso: 'Historia', nota: 12 },
  { id: 5, nombre: 'Sofía Vega', curso: 'Ciencias', nota: 8 },
  { id: 6, nombre: 'Diego Lara', curso: 'Inglés', nota: 16 },
  { id: 7, nombre: 'Valeria Cruz', curso: 'Ciencias', nota: 14 },
  { id: 8, nombre: 'Jorge Silva', curso: 'Comunicación', nota: 10 }
];

@Injectable({ providedIn: 'root' })
export class EstudiantesService {
  estudiantes = signal<Estudiante[]>(this.leer());

  guardar(datos: Omit<Estudiante, 'id'>, id: number | null): void {
    if (id === null) {
      const siguiente = Math.max(0, ...this.estudiantes().map((e) => e.id)) + 1;
      this.estudiantes.update((lista) => [...lista, { id: siguiente, ...datos }]);
    } else {
      this.estudiantes.update((lista) => lista.map((e) => (e.id === id ? { id, ...datos } : e)));
    }
    this.persistir();
  }

  borrar(id: number): void {
    this.estudiantes.update((lista) => lista.filter((e) => e.id !== id));
    this.persistir();
  }

  nombreUsado(nombre: string, idExcluido: number | null): boolean {
    const buscado = nombre.trim().toLowerCase();
    return this.estudiantes().some((e) => e.id !== idExcluido && e.nombre.toLowerCase() === buscado);
  }

  private persistir(): void {
    localStorage.setItem(CLAVE, JSON.stringify(this.estudiantes()));
  }

  private leer(): Estudiante[] {
    try {
      const guardado = localStorage.getItem(CLAVE);
      return guardado ? JSON.parse(guardado) : INICIALES.map((e) => ({ ...e }));
    } catch {
      return INICIALES.map((e) => ({ ...e }));
    }
  }
}
