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

const REFRESH_TOKEN_KEY = 'teqetari_refresh_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Access token lives in memory only — never localStorage/sessionStorage.
  // It's readable by any script on the page, so persisting it there is an XSS risk.
  private _accessToken: string | null = null;

  // Signal so components (e.g. a nav bar) can reactively show logged-in state.
  readonly isAuthenticated = signal<boolean>(false);

  constructor(private http: HttpClient) {}

  get accessToken(): string | null {
    return this._accessToken;
  }

  registerEmployee(dto: CreateEmployeeDto): Observable<void> {
    return this.http.post<void>(`${API_BASE_URL}/auth/register/employee`, dto);
  }

  registerEmployer(dto: CreateEmployerDto): Observable<void> {
    // $type must be the FIRST key in the JSON body for the backend's polymorphic
    // deserialization to pick the right subtype. CHANGED: destructure $type out
    // of dto first so the spread below can't redeclare/overwrite it — TS flagged
    // the old `{ $type: dto.$type, ...dto }` as a redundant duplicate key.
    const { $type, ...rest } = dto;
    const ordered = { $type, ...rest };
    return this.http.post<void>(`${API_BASE_URL}/auth/register/employer`, ordered);
  }

  login(dto: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_BASE_URL}/auth/login`, dto).pipe(
      tap((res) => this.setSession(res))
    );
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

  /** Call once on app bootstrap to silently restore a session after a page refresh. */
  tryRestoreSession(): Observable<AuthResponse> {
    return this.refresh();
  }

  private setSession(res: AuthResponse): void {
    this._accessToken = res.accessToken;
    localStorage.setItem(REFRESH_TOKEN_KEY, res.refreshToken);
    this.isAuthenticated.set(true);
  }
}