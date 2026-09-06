import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { JobPostService } from '../../services/job-post.service';
import { JobPostResponse } from '../../Models/jobPost.model';
import { JobApplicationService } from '../../services/job-application.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorResponse } from '../../Models/hire-request.model';


@Component({
  selector: 'app-browse-jobs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './browse-job.html',
  styleUrl: './browse-job.scss',
})
export class BrowseJobsComponent implements OnInit {
  private jobPostService = inject(JobPostService);
  private jobApplicationService = inject(JobApplicationService);
  private fb = inject(FormBuilder);
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
    this.isLoading.set(true);
    this.jobPostService.getAllJobs().subscribe({
      next: (list) => {
        this.jobs.set(list);
        this.isLoading.set(false);
      },
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

    this.jobApplicationService
      .apply({ jobPostId: jobId, coverMessage: raw.coverMessage || undefined })
      .subscribe({
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