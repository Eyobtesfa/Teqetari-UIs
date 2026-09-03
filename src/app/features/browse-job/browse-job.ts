import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { JobPostService } from '../../services/job-post.service';
import { JobPostResponse } from '../../Models/jobPost.model';

@Component({
  selector: 'app-browse-jobs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './browse-job.html',
  styleUrl: './browse-job.scss',
})
export class BrowseJobsComponent implements OnInit {
  private jobPostService = inject(JobPostService);

  readonly jobs = signal<JobPostResponse[]>([]);
  readonly isLoading = signal(false);

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
}