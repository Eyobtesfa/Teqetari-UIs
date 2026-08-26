import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiErrorResponse, JOB_CATEGORIES } from '../../Models/auth.model';

@Component({
  selector: 'app-register-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register-employee.component.html',
  styleUrl: './register-employee.component.css',
})
export class RegisterEmployeeComponent {
  // CHANGED: inject() instead of constructor params — see login.component.ts for why.
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  readonly isSubmitting = signal(false);
  readonly errorMessages = signal<string[]>([]);
  readonly jobCategories = JOB_CATEGORIES;

  readonly form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^0\d{9}$/)]],
    email: ['', [Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    nationalIdNumber: ['', Validators.required],
    city: ['', Validators.required],
    subCity: ['', Validators.required],
    woreda: ['', Validators.required],
    yearsOfExperience: [0, [Validators.required, Validators.min(0)]],
    expectedSalary: [0, [Validators.required, Validators.min(0)]],
    jobCategory: ['', Validators.required],
    skills: [''], // comma-separated input, split before submit
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessages.set([]);
    this.isSubmitting.set(true);

    const raw = this.form.getRawValue();

    this.authService
      .registerEmployee({
        firstName: raw.firstName!,
        lastName: raw.lastName!,
        phoneNumber: raw.phoneNumber!,
        email: raw.email || undefined,
        password: raw.password!,
        nationalIdNumber: raw.nationalIdNumber!,
        city: raw.city!,
        subCity: raw.subCity!,
        woreda: raw.woreda!,
        yearsOfExperience: Number(raw.yearsOfExperience),
        expectedSalary: Number(raw.expectedSalary),
        jobCategory: raw.jobCategory as any,
        skills: raw.skills
          ? raw.skills.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
      })
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.router.navigate(['/login']);
        },
        error: (err: HttpErrorResponse) => {
          this.isSubmitting.set(false);
          this.errorMessages.set(this.extractErrors(err));
        },
      });
  }

  private extractErrors(err: HttpErrorResponse): string[] {
    const body = err.error as ApiErrorResponse | undefined;
    if (body?.errors?.length) return body.errors;
    return [body?.errorMessage ?? body?.title ?? 'Registration failed. Please try again.'];
  }
}
