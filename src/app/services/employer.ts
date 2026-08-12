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
  
  
  private baseUrl = 'http://localhost:5134/api/employers';


  registerEmployer(dto: CreateEmployerPayload): Observable<EmployerResponse> {
    return this.http.post<EmployerResponse>(this.baseUrl, dto);
  }
}