import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiErrorResponse } from '../../Models/auth.model';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  private notificationService = inject(NotificationService);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.group({
    identifier: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage.set(null);
    this.isSubmitting.set(true);

    const { identifier, password } = this.form.getRawValue();

    this.authService
      .login({ identifier: identifier!, password: password! })
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          const userType = this.authService.getUserType();
          this.notificationService.connect();
          this.router.navigate([userType === 'EMPLOYER' ? '/employer-dash' : '/employee-dash']);
        },
        error: (err: HttpErrorResponse) => {
          this.isSubmitting.set(false);
          this.errorMessage.set(this.extractError(err));
        },
      });
  }

  private extractError(err: HttpErrorResponse): string {
    const body = err.error as ApiErrorResponse | undefined;
    if (err.status === 423) return 'Account locked due to multiple failed attempts. Try again later.';
    if (err.status === 401) return 'Invalid credentials.';
    return body?.errorMessage ?? body?.title ?? 'Something went wrong. Please try again.';
  }
}
