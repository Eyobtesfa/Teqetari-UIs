import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CreateEmployee, EmployeeResponse } from '../Models/employee.model';  
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root'})
export class EmployeeService{
  private http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/employees`;

  registerEmployee(dto: CreateEmployee){
    return this.http.post<EmployeeResponse>(this.base, dto);
  }
}