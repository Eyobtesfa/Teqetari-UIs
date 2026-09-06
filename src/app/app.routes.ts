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
  path: 'sent-requests',
  canActivate: [authGuard],
  loadComponent: () => import('./features/sent-requests/sent-requests').then(m => m.SentRequestsComponent),
},
{
  path: 'received-requests',
  canActivate: [authGuard],
  loadComponent: () => import('./features/received-requests/received-requests').then(m => m.ReceivedRequestsComponent),
},
{
  path: 'browse-employers',
  canActivate: [authGuard],
  loadComponent: () => import('./features/browse-employers/browse-employers').then(m => m.BrowseEmployersComponent),
},
{
  path: 'browse-job',
  canActivate: [authGuard],
  loadComponent: () => import('./features/browse-job/browse-job').then(m => m.BrowseJobsComponent),
},
{
  path: 'employee-dash',
  canActivate: [authGuard],
  loadComponent: () =>
    import('./features/employee-dash/employee-dash').then(
      (m) => m.EmployeeDashboardComponent
    ),
},
{
  path: 'placement-contract/:id',
  canActivate: [authGuard],
  loadComponent: () =>
    import('./features/placement-contract/placement-contract.component').then(
      (m) => m.PlacementContractComponent
    ),
},
{
  path: 'my-contracts',
  canActivate: [authGuard],
  loadComponent: () => import('./features/my-contracts/my-contracts').then(m => m.MyContractsComponent),
},
{
  path: 'employer-jobs/:id',
  canActivate: [authGuard],
  loadComponent: () => import('./features/employer-jobs/employer-jobs').then(m => m.EmployerJobsComponent),
},
  {
   path: '**', redirectTo: 'landing'
  },
  
];
