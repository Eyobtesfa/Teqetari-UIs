import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_BASE_URL } from './api-config';

@Injectable({ providedIn: 'root' })
export class PlacementContractService {
  constructor(private http: HttpClient) {}

  getPdfDownloadUrl(contractId: number): string {
    return `${API_BASE_URL}/placement-contracts/${contractId}/pdf`;
  }

  downloadContractPdf(contractId: number): void {
  this.http.get(this.getPdfDownloadUrl(contractId), { responseType: 'blob' }).subscribe((blob) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `placement-contract-${contractId}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
  });
}
}