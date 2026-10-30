import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { noEstudianteGuard } from './guards/no-estudiante-guard';
import { Shell } from './shell/shell';
import { Login } from './login/login';
import { Dashboard } from './dashboard/dashboard';
import { Estudiantes } from './estudiantes/estudiantes';

export const routes: Routes = [
  { path: 'login', component: Login },
  {
    path: '',
    component: Shell,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: Dashboard, canActivate: [noEstudianteGuard] },
      { path: 'estudiantes', component: Estudiantes },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '' }
];
