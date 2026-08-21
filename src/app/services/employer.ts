import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateEmployerPayload } from '../Models/employer.model';
import { environment } from '../../environments/environment';

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
  
  
  private readonly base = `${environment.apiUrl}`;


  registerEmployer(dto: CreateEmployerPayload): Observable<EmployerResponse> {
    return this.http.post<EmployerResponse>(this.base, dto);
  }
}