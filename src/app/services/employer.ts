import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {  EmployerResponse } from '../Models/employer.model';

import { API_BASE_URL } from './api-config';

// Generic response interface matching backend API return structure
/*export interface EmployerResponse {
  id: string;
  email: string;
  employerType: number;
  message?: string;
}*/

@Injectable({
  providedIn: 'root'
})
export class EmployerService {
  private http = inject(HttpClient);
  
  
  private readonly base = `${API_BASE_URL}/employers`;


  getEmployers(): Observable<EmployerResponse[]> {
    return this.http.get<EmployerResponse[]>(this.base);
  }
}