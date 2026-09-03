import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HireRequestService } from '../../services/hire-request.service';
import { ApiErrorResponse, HireRequestResponse, HireRequestStatus } from '../../Models/hire-request.model';

@Component({
  selector: 'app-received-requests',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './received-requests.html',
  styleUrl: './received-requests.scss',
})
export class ReceivedRequestsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private hireRequestService = inject(HireRequestService);

  readonly requests = signal<HireRequestResponse[]>([]);
  readonly isLoading = signal(false);
  readonly openActionFor = signal<{ id: number; accept: boolean } | null>(null);
  readonly isResponding = signal(false);
  readonly responseError = signal<string | null>(null);
  readonly HireRequestStatus = HireRequestStatus;

  readonly acceptForm = this.fb.group({
    chosenStartDate: ['', Validators.required],
    chosenEndDate: [''],
    agencyCommissionPercentage: [0],
  });

  readonly declineForm = this.fb.group({
    declineReason: [''],
  });

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.isLoading.set(true);
    this.hireRequestService.getReceivedRequests().subscribe({
      next: (list) => {
        this.requests.set(list);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  openAccept(id: number): void {
    this.responseError.set(null);
    this.acceptForm.reset({ chosenStartDate: '', chosenEndDate: '', agencyCommissionPercentage: 0 });
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

  confirmAccept(id: number): void {
    if (this.acceptForm.invalid) {
      this.acceptForm.markAllAsTouched();
      return;
    }

    const raw = this.acceptForm.getRawValue();
    this.isResponding.set(true);

    this.hireRequestService
      .respond(id, {
        accept: true,
        chosenStartDate: raw.chosenStartDate!,
        chosenEndDate: raw.chosenEndDate || undefined,
        agencyCommissionPercentage: raw.agencyCommissionPercentage ?? undefined,
      })
      .subscribe({
        next: () => {
          this.isResponding.set(false);
          this.openActionFor.set(null);
          this.load();
        },
        error: (err: HttpErrorResponse) => {
          this.isResponding.set(false);
          this.responseError.set(this.extractError(err));
        },
      });
  }

  confirmDecline(id: number): void {
    const raw = this.declineForm.getRawValue();
    this.isResponding.set(true);

    this.hireRequestService
      .respond(id, { accept: false, declineReason: raw.declineReason || undefined })
      .subscribe({
        next: () => {
          this.isResponding.set(false);
          this.openActionFor.set(null);
          this.load();
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