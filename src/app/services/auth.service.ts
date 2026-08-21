import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { TeqetariUser, LoginRequest } from '../Models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/auth`;

  currentUser = signal<TeqetariUser | null>(null);

  hasRole(role: 'Employee' | 'Employer'): boolean {
    return this.currentUser()?.role === role;
  }

  async login(credentials: LoginRequest) {
    await firstValueFrom(this.http.post<void>(`${this.base}/login`, credentials));
    const user = await firstValueFrom(this.http.get<TeqetariUser>(`${this.base}/me`));
    this.currentUser.set(user);
  }

  async logout() {
    await firstValueFrom(this.http.post<void>(`${this.base}/logout`, {}));
    this.currentUser.set(null);
  }
}