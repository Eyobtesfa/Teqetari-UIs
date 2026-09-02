import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CreateEmployee, EmployeeFilter, EmployeeFilterResponse, EmployeeResponse } from '../Models/employee.model';  
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api-config';

@Injectable({ providedIn: 'root'})
export class EmployeeService{
  private http = inject(HttpClient);
  private readonly base = `${API_BASE_URL}/employees`;

  registerEmployee(dto: CreateEmployee){
    return this.http.post<EmployeeResponse>(this.base, dto);
  }

  getEmployees(filter: EmployeeFilter): Observable<EmployeeFilterResponse[]>{
    let params = new HttpParams();
    if(filter.category != null) params = params.set('category', filter.category);
    if(filter.city) params = params.set('city', filter.city);
    if(filter.minYearsOfExperience != null) params = params.set('minYearsOfExperience', filter.minYearsOfExperience);
    if(filter.maxExpectedSalary != null) params = params.set('maxExpectedSalary', filter.maxExpectedSalary);
    if(filter.minExpectedSalary != null) params = params.set('minExpectedSalary', filter.minExpectedSalary);

    return this.http.get<EmployeeFilterResponse[]>(`${API_BASE_URL}/employees`, {params});
  }
}