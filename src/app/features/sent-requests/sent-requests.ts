import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { HireRequestService } from '../../services/hire-request.service';
import { HireRequestResponse, HireRequestStatus } from '../../Models/hire-request.model';

@Component({
  selector: 'app-sent-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sent-requests.html',
  styleUrl: './sent-requests.scss',
})
export class SentRequestsComponent implements OnInit {
  private hireRequestService = inject(HireRequestService);

  readonly requests = signal<HireRequestResponse[]>([]);
  readonly isLoading = signal(false);
  readonly HireRequestStatus = HireRequestStatus; // expose enum to template

  ngOnInit(): void {
    this.isLoading.set(true);
    this.hireRequestService.getSentRequests().subscribe({
      next: (list) => {
        this.requests.set(list);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  statusLabel(status: HireRequestStatus): string {
    switch (status) {
      case HireRequestStatus.Pending: return 'Pending';
      case HireRequestStatus.Accepted: return 'Accepted';
      case HireRequestStatus.Declined: return 'Declined';
    }
  }
}