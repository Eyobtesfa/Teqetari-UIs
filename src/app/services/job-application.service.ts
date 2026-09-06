import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateJobApplication, JobApplicationResponse, RespondToJobApplication } from '../Models/job-application.model';
import { JobPostResponse } from '../Models/jobPost.model';
import { API_BASE_URL } from './api-config';

@Injectable({ providedIn: 'root' })
export class JobApplicationService {
  constructor(private http: HttpClient) {}

  apply(dto: CreateJobApplication): Observable<JobApplicationResponse> {
    return this.http.post<JobApplicationResponse>(`${API_BASE_URL}/job-applications`, dto);
  }

  getMyApplications(): Observable<JobApplicationResponse[]> {
    return this.http.get<JobApplicationResponse[]>(`${API_BASE_URL}/job-applications/mine`);
  }

  getApplicants(jobPostId: number): Observable<JobApplicationResponse[]> {
    return this.http.get<JobApplicationResponse[]>(`${API_BASE_URL}/job-applications/job/${jobPostId}`);
  }

  respond(id: number, dto: RespondToJobApplication): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`${API_BASE_URL}/job-applications/${id}/respond`, dto);
  }

  getJobsByEmployer(employerId: number): Observable<JobPostResponse[]> {
    return this.http.get<JobPostResponse[]>(`${API_BASE_URL}/postJob/employer/${employerId}`);
  }
}