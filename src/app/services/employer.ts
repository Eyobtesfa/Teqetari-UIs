import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateEmployerPayload } from '../Models/employer.model';

// Generic response interface matching backend API return structure
export interface EmployerResponse {
  id: string;
  email: string;
  employerType: number;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmployerService {
  private http = inject(HttpClient);
  
  // Update base URL to match your backend port configuration
  private baseUrl = 'http://localhost:5134/api/employers';

  /**
   * Sends a polymorphic employer registration request to the backend.
   * Handles Household, PrivateCompany, and GovernmentOrganization payloads.
   * 
   * @param dto CreateEmployerPayload (Union of Household, Company, or Government models)
   * @returns Observable<EmployerResponse>
   */
  registerEmployer(dto: CreateEmployerPayload): Observable<EmployerResponse> {
    return this.http.post<EmployerResponse>(this.baseUrl, dto);
  }
}