import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import {
  AuthResponse,
  CreateEmployeeDto,
  CreateEmployerDto,
  LoginDto,
  RefreshTokenDto,
} from '../Models/auth.model';
import { API_BASE_URL } from './api-config';
import { jwtDecode } from 'jwt-decode';

const REFRESH_TOKEN_KEY = 'teqetari_refresh_token';
interface DecodedToken {
    UserType? :string;
    [key: string] : unknown
  }

@Injectable({ providedIn: 'root' })
export class AuthService {
  
  private _accessToken: string | null = null;

  
  readonly isAuthenticated = signal<boolean>(false);

  constructor(private http: HttpClient) {}

  get accessToken(): string | null {
    return this._accessToken;
  }

  registerEmployee(dto: CreateEmployeeDto): Observable<void> {
    return this.http.post<void>(`${API_BASE_URL}/auth/register/employee`, dto);
  }

  registerEmployer(dto: CreateEmployerDto): Observable<void> {
   
    const { $type, ...rest } = dto;
    const ordered = { $type, ...rest };
    return this.http.post<void>(`${API_BASE_URL}/auth/register/employer`, ordered);
  }

  login(dto: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_BASE_URL}/auth/login`, dto).pipe(
      tap((res) => this.setSession(res))
    );
  }


  getUserType(): string | null {
  if (!this._accessToken) return null;
  try {
    const decoded = jwtDecode<DecodedToken>(this._accessToken);
    return decoded.UserType ?? null;
  } catch {
    return null;
  }
}

  refresh(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available.'));
    }

    const body: RefreshTokenDto = { refreshToken };
    return this.http.post<AuthResponse>(`${API_BASE_URL}/auth/refresh`, body).pipe(
      tap((res) => this.setSession(res)),
      catchError((err) => {
        // Refresh token is invalid/expired/reused — force a clean logout.
        this.logout();
        return throwError(() => err);
      })
    );
  }

  logout(): void {
    this._accessToken = null;
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    this.isAuthenticated.set(false);
  }

  
  tryRestoreSession(): Observable<AuthResponse> {
    return this.refresh();
  }

  private setSession(res: AuthResponse): void {
    this._accessToken = res.accessToken;
    localStorage.setItem(REFRESH_TOKEN_KEY, res.refreshToken);
    this.isAuthenticated.set(true);
  }
}