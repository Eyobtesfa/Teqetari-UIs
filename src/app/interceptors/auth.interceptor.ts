import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

// Endpoints that should never get an Authorization header, and whose 401s
// should never trigger a refresh-and-retry (that would loop forever).
const AUTH_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/refresh'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const isAuthEndpoint = AUTH_ENDPOINTS.some((path) => req.url.includes(path));

  const token = authService.accessToken;
  const authReq = token && !isAuthEndpoint
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: unknown) => {
      const is401 = error instanceof HttpErrorResponse && error.status === 401;

      if (!is401 || isAuthEndpoint) {
        return throwError(() => error);
      }

      // Access token expired mid-session — try a silent refresh, then retry once.
      return authService.refresh().pipe(
        switchMap(() => {
          const retryReq = req.clone({
            setHeaders: { Authorization: `Bearer ${authService.accessToken}` },
          });
          return next(retryReq);
        }),
        catchError((refreshError) => throwError(() => refreshError))
      );
    })
  );
};
