import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { API_BASE_URL } from "./api-config";
import { CreateHireRequest,HireRequestResponse,RespondToHireRequest } from "../Models/hire-request.model";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root'})
export class HireRequestService{
    private http = inject(HttpClient);
    private readonly base = `${API_BASE_URL}/hire-request`;

    sendHireRequest(dto: CreateHireRequest): Observable<HireRequestResponse> {
        return this.http.post<HireRequestResponse>(this.base, dto);
}
getSentRequests(): Observable<HireRequestResponse[]> {
  return this.http.get<HireRequestResponse[]>(`${API_BASE_URL}/hire-request/sent`);
}

getReceivedRequests(): Observable<HireRequestResponse[]> {
  return this.http.get<HireRequestResponse[]>(`${API_BASE_URL}/hire-request/received`);
}

respond(id: number, dto: RespondToHireRequest): Observable<{ message: string }> {
  return this.http.patch<{ message: string }>(`${API_BASE_URL}/hire-request/${id}/respond`, dto);
}
}