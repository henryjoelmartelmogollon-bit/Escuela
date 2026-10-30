import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { map } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../servicios/auth.service';

@Component({
  selector: 'app-shell',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './shell.html',
  styleUrl: './shell.css'
})
export class Shell {
  private auth = inject(AuthService);
  private router = inject(Router);
  private breakpoints = inject(BreakpointObserver);

  email = this.auth.obtenerEmail();
  esEstudiante = this.auth.esEstudiante();

  esMovil = toSignal(
    this.breakpoints.observe('(max-width: 800px)').pipe(map((resultado) => resultado.matches)),
    { initialValue: false }
  );

  salir(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
