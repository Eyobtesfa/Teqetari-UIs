import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PlacementContractService } from '../../services/placement-contract.service';

@Component({
  selector: 'app-placement-contract',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './placement-contract.html',
  styleUrl: './placement-contract.scss',
})
export class PlacementContractComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private contractService = inject(PlacementContractService);

  readonly contractId = signal<number | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.contractId.set(id);
  }

  download(): void {
    const id = this.contractId();
    if (id) this.contractService.downloadContractPdf(id);
  }
}