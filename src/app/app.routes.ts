import { Routes } from '@angular/router';

export const routes: Routes = [
    {path: '', redirectTo: 'landing', pathMatch: 'full'},
    {
        path: 'landing',
        loadComponent: () => 
            import('./features/landing/landing.component').then((m) => m.LandingComponent),
    },
    {
        path: 'register-employee',
        loadComponent: () =>
            import('./features/register-employee/register-employee.component').then((m) => m.RegisterEmployeeComponent),
    },
];
