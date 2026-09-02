import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {path: '', redirectTo: 'landing', pathMatch: 'full'},
    {
    path: 'landing',
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
  path: 'employer-dash',
  canActivate: [authGuard],
  loadComponent: () =>
    import('./features/employer-dash/employer-dash.component').then(
      (m) => m.EmployerDashboardComponent
    ),
},
{
  path: 'job-post',
  canActivate: [authGuard],
  loadComponent: () =>
    import('./features/job-post/job-post.component').then((m) => m.JobPostComponent),
},
{
  path: 'browse-employees',
  canActivate: [authGuard],
  loadComponent: () =>
    import('./features/browse-employees/browse-employees.component').then(
      (m) => m.BrowseEmployeesComponent
    ),
},
  {
   path: '**', redirectTo: 'landing'
  },
  
];
