import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { EmployerService } from '../../services/employer';
import { EmployerResponse } from '../../Models/employer.model';

@Component({
  selector: 'app-browse-employers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './browse-employers.html',
  styleUrl: './browse-employers.scss',
})
export class BrowseEmployersComponent implements OnInit {
  private employerService = inject(EmployerService);

  readonly employers = signal<EmployerResponse[]>([]);
  readonly isLoading = signal(false);

  ngOnInit(): void {
    this.isLoading.set(true);
    this.employerService.getEmployers().subscribe({
      next: (list) => {
        this.employers.set(list);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  displayName(e: EmployerResponse): string {
    switch (e.$type) {
      case 'Household': return e.fullName;
      case 'PrivateCompany': return e.companyName;
      case 'GovernmentOrganization': return e.organizationName;
    }
  }
}