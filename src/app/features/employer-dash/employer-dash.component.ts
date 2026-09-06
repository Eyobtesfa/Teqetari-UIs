import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { JobPostService } from '../../services/job-post.service';
import { JobPostResponse, JOB_CATEGORY_OPTIONS } from '../../Models/jobPost.model';
import { NotificationService } from '../../services/notification.service';
import { NotificationPanelComponent } from '../notification-panel/notification-panel';
import { JobApplicationService } from '../../services/job-application.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApplicationStatus, JobApplicationResponse } from '../../Models/job-application.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorResponse } from '../../Models/hire-request.model';
import { JobCategory } from '../../Models/enum/job-category.enum';

@Component({
  selector: 'app-employer-dash',
  standalone: true,
  imports: [CommonModule, RouterLink, NotificationPanelComponent, ReactiveFormsModule],
  templateUrl: './employer-dash.html',
  styleUrl: './employer-dash.scss',
})
export class EmployerDashboardComponent implements OnInit {
  private jobPostService = inject(JobPostService);
  notificationService = inject(NotificationService)
  private jobApplicationService = inject(JobApplicationService);
  private fb = inject(FormBuilder);
  readonly jobs = signal<JobPostResponse[]>([]);
  readonly isLoading = signal(false);
  readonly ApplicationStatus = ApplicationStatus;
  

  readonly openApplicantsForJobId = signal<number | null>(null);
  readonly applicants = signal<JobApplicationResponse[]>([]);
  readonly isLoadingApplicants = signal(false);


    readonly openActionFor = signal<{ id: number; accept: boolean } | null>(null);
  readonly isResponding = signal(false);
  readonly responseError = signal<string | null>(null);

  readonly acceptForm = this.fb.group({
    chosenStartDate: ['', Validators.required],
    chosenEndDate: [''],
    agreedSalary: [null as number | null],
    agencyCommissionPercentage: [0],
  });

  readonly declineForm = this.fb.group({
    declineReason: [''],
  });

  ngOnInit(): void {
    this.loadJobs();
  }

  private loadJobs(): void {
    this.isLoading.set(true);
    this.jobPostService.getMyJobs().subscribe({
      next: (jobs) => {
        this.jobs.set(jobs);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  toggleApplicants(jobId: number): void {
    if (this.openApplicantsForJobId() === jobId) {
      this.openApplicantsForJobId.set(null);
      return;
    }
    this.openApplicantsForJobId.set(jobId);
    this.openActionFor.set(null);
    this.loadApplicants(jobId);
  }

  jobCategoryLabel(category: JobCategory): string {
  return JOB_CATEGORY_OPTIONS.find(o => o.value === category)?.label ?? '';
}

  private loadApplicants(jobId: number): void {
    this.isLoadingApplicants.set(true);
    this.jobApplicationService.getApplicants(jobId).subscribe({
      next: (list) => {
        this.applicants.set(list);
        this.isLoadingApplicants.set(false);
      },
      error: () => this.isLoadingApplicants.set(false),
    });
  }

  openAccept(id: number): void {
    this.responseError.set(null);
    this.acceptForm.reset({ chosenStartDate: '', chosenEndDate: '', agreedSalary: null, agencyCommissionPercentage: 0 });
    this.openActionFor.set({ id, accept: true });
  }

  openDecline(id: number): void {
    this.responseError.set(null);
    this.declineForm.reset({ declineReason: '' });
    this.openActionFor.set({ id, accept: false });
  }

  closeAction(): void {
    this.openActionFor.set(null);
  }

  confirmAccept(id: number, jobId: number): void {
    if (this.acceptForm.invalid) {
      this.acceptForm.markAllAsTouched();
      return;
    }
    const raw = this.acceptForm.getRawValue();
    this.isResponding.set(true);

    this.jobApplicationService
      .respond(id, {
        accept: true,
        chosenStartDate: raw.chosenStartDate!,
        chosenEndDate: raw.chosenEndDate || undefined,
        agreedSalary: raw.agreedSalary ?? undefined,
        agencyCommissionPercentage: raw.agencyCommissionPercentage ?? undefined,
      })
      .subscribe({
        next: () => {
          this.isResponding.set(false);
          this.openActionFor.set(null);
          this.loadApplicants(jobId);
        },
        error: (err: HttpErrorResponse) => {
          this.isResponding.set(false);
          this.responseError.set(this.extractError(err));
        },
      });
  }

  confirmDecline(id: number, jobId: number): void {
    const raw = this.declineForm.getRawValue();
    this.isResponding.set(true);

    this.jobApplicationService
      .respond(id, { accept: false, declineReason: raw.declineReason || undefined })
      .subscribe({
        next: () => {
          this.isResponding.set(false);
          this.openActionFor.set(null);
          this.loadApplicants(jobId);
        },
        error: (err: HttpErrorResponse) => {
          this.isResponding.set(false);
          this.responseError.set(this.extractError(err));
        },
      });
  }

  private extractError(err: HttpErrorResponse): string {
    const body = err.error as ApiErrorResponse | undefined;
    return body?.error ?? body?.title ?? 'Failed to respond.';
  }
}
