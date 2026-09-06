import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { JobApplicationService } from '../../services/job-application.service';
import { JobPostResponse } from '../../Models/jobPost.model';
import { ApiErrorResponse } from '../../Models/hire-request.model';

@Component({
  selector: 'app-employer-jobs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employer-jobs.html',
  styleUrl: './employer-jobs.scss',
})
export class EmployerJobsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private jobApplicationService = inject(JobApplicationService);

  readonly jobs = signal<JobPostResponse[]>([]);
  readonly isLoading = signal(false);
  readonly openFormForJobId = signal<number | null>(null);
  readonly isSubmitting = signal(false);
  readonly submitError = signal<string | null>(null);
  readonly appliedTo = signal<Set<number>>(new Set());

  readonly applyForm = this.fb.group({
    coverMessage: [''],
  });

  ngOnInit(): void {
    const employerId = Number(this.route.snapshot.paramMap.get('id'));
    this.isLoading.set(true);
    this.jobApplicationService.getJobsByEmployer(employerId).subscribe({
      next: (list) => { this.jobs.set(list); this.isLoading.set(false); },
      error: () => this.isLoading.set(false),
    });
  }

  openApply(jobId: number): void {
    this.submitError.set(null);
    this.applyForm.reset({ coverMessage: '' });
    this.openFormForJobId.set(jobId);
  }

  closeApply(): void {
    this.openFormForJobId.set(null);
  }

  submitApplication(jobId: number): void {
    this.isSubmitting.set(true);
    const raw = this.applyForm.getRawValue();

    this.jobApplicationService.apply({ jobPostId: jobId, coverMessage: raw.coverMessage || undefined }).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.openFormForJobId.set(null);
        this.appliedTo.update((set) => new Set(set).add(jobId));
      },
      error: (err: HttpErrorResponse) => {
        this.isSubmitting.set(false);
        const body = err.error as ApiErrorResponse | undefined;
        this.submitError.set(body?.errors?.join(' ') ?? body?.error ?? 'Failed to apply.');
      },
    });
  }
}