import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CreateEmployee, EmployeeResponse } from '../Models/employee.model';  

@Injectable({ providedIn: 'root'})
export class EmployeeService{
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:5134/api/employees';

  registerEmployee(dto: CreateEmployee){
    return this.http.post<EmployeeResponse>(this.baseUrl, dto);
  }
}