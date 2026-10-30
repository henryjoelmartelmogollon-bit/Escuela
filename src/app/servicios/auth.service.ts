import { Injectable } from '@angular/core';

interface Usuario {
  email: string;
  password: string;
  rol: string;
  nombre: string;
}

const USUARIOS: Usuario[] = [
  { email: 'admin@escuela.com', password: 'admin123', rol: 'admin', nombre: 'Administrador' },
  { email: 'user@escuela.com', password: 'user123', rol: 'usuario', nombre: 'Usuario' },
  { email: 'ana@escuela.com', password: 'ana123', rol: 'estudiante', nombre: 'Ana Torres' }
];

const CLAVE = 'sesionEscuela';

@Injectable({ providedIn: 'root' })
export class AuthService {
  login(email: string, password: string): boolean {
    const usuario = USUARIOS.find((u) => u.email === email && u.password === password);
    if (!usuario) {
      return false;
    }
    localStorage.setItem(CLAVE, JSON.stringify({ email: usuario.email, rol: usuario.rol, nombre: usuario.nombre }));
    return true;
  }

  logout(): void {
    localStorage.removeItem(CLAVE);
  }

  estaLogueado(): boolean {
    return this.leerSesion() !== null;
  }

  esAdmin(): boolean {
    return this.leerSesion()?.rol === 'admin';
  }

  esEstudiante(): boolean {
    return this.leerSesion()?.rol === 'estudiante';
  }

  obtenerEmail(): string {
    return this.leerSesion()?.email ?? '';
  }

  obtenerNombre(): string {
    return this.leerSesion()?.nombre ?? '';
  }

  private leerSesion(): { email: string; rol: string; nombre: string } | null {
    try {
      const guardado = localStorage.getItem(CLAVE);
      return guardado ? JSON.parse(guardado) : null;
    } catch {
      return null;
    }
  }
}
