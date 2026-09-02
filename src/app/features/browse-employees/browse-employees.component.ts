import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeService } from '../../services/employee';
import { EmployeeFilterResponse } from '../../Models/employee.model';
import { HttpErrorResponse } from '@angular/common/http';
import { HireRequestService } from '../../services/hire-request.service';
import { ApiErrorResponse } from '../../Models/hire-request.model';

@Component({
  selector: 'app-browse-employees',
  standalone : true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './browse-employees.html',
  styleUrl: './browse-employees.scss',
})
export class BrowseEmployeesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private employeeService = inject(EmployeeService);
  private hireRequestService = inject(HireRequestService);

  readonly employees = signal<EmployeeFilterResponse[]>([]);
  readonly isLoading = signal(false);


  readonly openFormForEmployeeId = signal<number | null>(null);
  readonly isSending = signal(false);
  readonly sendError = signal<string | null>(null);
  readonly sentSuccessfullyFor = signal<number | null>(null);

  readonly filterForm = this.fb.group({
    category: [null as number | null],
    city: [''],
    minYearsOfExperience: [null as number | null],
    maxExpectedSalary: [null as number | null],
    minExpectedSalary: [null as number | null]
  });

  readonly hireRequestForm = this.fb.group({
    offeredSalary: [0, [Validators.required, Validators.min(0)]],
    message: [''],
    startDateFrom: ['', Validators.required],
    startDateTo: ['', Validators.required]
  });

  ngOnInit(): void {
    this.search(); 
  }

  search(): void {
    this.isLoading.set(true);
    const raw = this.filterForm.getRawValue();

    this.employeeService
      .getEmployees({
        category: raw.category,
        city: raw.city || null,
        minYearsOfExperience: raw.minYearsOfExperience,
        minExpectedSalary: raw.minExpectedSalary,
        maxExpectedSalary: raw.maxExpectedSalary
      })
      .subscribe({
        next: (list) => {
          this.employees.set(list);
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false),
      });
  }

  openHireRequestForm(employeeId: number): void {
    this.sendError.set(null);
    this.sentSuccessfullyFor.set(null);
    this.hireRequestForm.reset({
      offeredSalary: 0,
      message: '',
      startDateFrom: '',
      startDateTo: ''
    });
    this.openFormForEmployeeId.set(employeeId);
  }
  closeHireRequestForm(): void {
    this.openFormForEmployeeId.set(null);
  }

  sendHireRequest(employeeId: number): void {
    if (this.hireRequestForm.invalid) {
      this.hireRequestForm.markAllAsTouched();
      return;
    }
  

  this.sendError.set(null);
  this.isSending.set(true);

  const raw = this.hireRequestForm.getRawValue();

  this.hireRequestService.sendHireRequest({
    employeeId,
    offeredSalary: Number(raw.offeredSalary),
    message: raw.message || undefined,
    startDateFrom: raw.startDateFrom!,
    startDateTo: raw.startDateTo!
  })
    .subscribe({
      next: () => {
        this.isSending.set(false);
        this.sentSuccessfullyFor.set(employeeId);
        this.openFormForEmployeeId.set(null);
      },
      error: (err: HttpErrorResponse) => {
        this.isSending.set(false);
        this.sendError.set(this.extractError(err));
      }
    });
}
private extractError(err: HttpErrorResponse): string {
    const body = err.error as ApiErrorResponse | undefined;
    if (Array.isArray(body?.errors)) return body.errors.join(' ');
    return body?.error ?? body?.title ?? 'Failed to send hire request.';
}
}