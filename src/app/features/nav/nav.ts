import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface NavLink {
  path: string;
  label: string;
}

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
})
export class NavComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  readonly isMobileMenuOpen = signal(false);

  readonly employerLinks: NavLink[] = [
    { path: '/employer-dash', label: 'Dashboard' },
    { path: '/job-post', label: 'Post a Job' },
    { path: '/browse-employees', label: 'Browse Employees' },
    { path: '/sent-requests', label: 'Sent Requests' },
    { path: '/my-contracts', label: 'My Contracts' },
  ];

  readonly employeeLinks: NavLink[] = [
    { path: '/employee-dash', label: 'Dashboard' },
    { path: '/browse-employers', label: 'Browse Employers' },
    { path: '/browse-jobs', label: 'Browse Jobs' },
    { path: '/received-requests', label: 'Received Requests' },
    { path: '/my-contracts', label: 'My Contracts' },
  ];

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  get userType(): string | null {
    return this.authService.getUserType();
  }

  get links(): NavLink[] {
    if (this.userType === 'Employer') return this.employerLinks;
    if (this.userType === 'Employee') return this.employeeLinks;
    return [];
  }

  get homePath(): string {
    if (this.userType === 'Employer') return '/employer-dash';
    if (this.userType === 'Employee') return '/employee-dash';
    return '/landing';
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((v) => !v);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  logout(): void {
    this.authService.logout();
    this.closeMobileMenu();
    this.router.navigate(['/login']);
  }
}