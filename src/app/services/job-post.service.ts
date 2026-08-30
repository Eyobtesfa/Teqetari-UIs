import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { CreateJobPost, JobPostResponse } from "../Models/jobPost.model";
import { API_BASE_URL } from "./api-config";
import { Observable } from "rxjs";

@Injectable({providedIn: 'root'})
export class JobPostService{
    private http = inject(HttpClient);
    private readonly base = `${API_BASE_URL}/postJob`;

    postJob(dto: CreateJobPost){
        return this.http.post<JobPostResponse>(this.base, dto);
    }
    getMyJobs(): Observable<JobPostResponse[]> {
  return this.http.get<JobPostResponse[]>(`${API_BASE_URL}/postJob/mine`);
}
}