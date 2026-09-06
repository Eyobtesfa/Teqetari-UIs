import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { JobPostService } from '../../services/job-post.service';
import { JobPostResponse } from '../../Models/jobPost.model';
import { NotificationService } from '../../services/notification.service';
import { NotificationPanelComponent } from '../notification-panel/notification-panel';

@Component({
  selector: 'app-employer-dash',
  standalone: true,
  imports: [CommonModule, RouterLink, NotificationPanelComponent],
  templateUrl: './employer-dash.html',
  styleUrl: './employer-dash.scss',
})
export class EmployerDashboardComponent implements OnInit {
  private jobPostService = inject(JobPostService);
  notificationService = inject(NotificationService)
  readonly jobs = signal<JobPostResponse[]>([]);
  readonly isLoading = signal(false);
  

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
}
