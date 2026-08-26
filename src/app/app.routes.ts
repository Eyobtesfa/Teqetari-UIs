import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {path: '', redirectTo: 'landing', pathMatch: 'full'},
    {
    path: 'landing',
    canActivate: [authGuard], // now the only 'landing' route, so the guard actually applies
    loadComponent: () =>
      import('./features/landing/landing.component').then((m) => m.LandingComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login.component').then((m) => m.LoginComponent),
  },
    {
    path: 'register/employee',
    loadComponent: () =>
      import('./features/register-employee/register-employee.component').then(
        (m) => m.RegisterEmployeeComponent
      ),
  },
    {
    path: 'register/employer',
    loadComponent: () =>
      import('./features/register-employer/register-employer.component').then(
        (m) => m.RegisterEmployerComponent
      ),
  },
  {
   path: '**', redirectTo: 'login'
  },
];
