
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { API_BASE_URL } from '../../services/api-config';
import { PlacementContractResponse } from '../../Models/placement-contract.model';

@Component({
  selector: 'app-my-contracts',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-contracts.html',
  styleUrl: './my-contracts.scss',
})
export class MyContractsComponent implements OnInit {
  private http = inject(HttpClient);

  readonly contracts = signal<PlacementContractResponse[]>([]);
  readonly isLoading = signal(false);

  ngOnInit(): void {
    this.isLoading.set(true);
    this.http.get<PlacementContractResponse[]>(`${API_BASE_URL}/placement-contracts/mine`).subscribe({
      next: (list) => { this.contracts.set(list); this.isLoading.set(false); },
      error: () => this.isLoading.set(false),
    });
  }

  cancel(id: number): void {
    this.http.post(`${API_BASE_URL}/placement-contracts/${id}/cancel`, {}).subscribe({
      next: () => this.contracts.update((list) =>
        list.map((c) => (c.id === id ? { ...c, isActive: false } : c))
      ),
    });
  }
}