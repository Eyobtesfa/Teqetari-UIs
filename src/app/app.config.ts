import { APP_INITIALIZER, ApplicationConfig, provideZonelessChangeDetection } from "@angular/core";
import { provideRouter, withComponentInputBinding } from "@angular/router";
import { provideHttpClient, withInterceptors, withXsrfConfiguration } from "@angular/common/http";
import { routes } from "./app.routes";
import { credentialsInterceptor } from "./interceptors/credentials.interceptor";
import { authInterceptor } from "./interceptors/auth.interceptor";
import { AuthService } from "./services/auth.service";
import { catchError, firstValueFrom, of } from "rxjs";

function initAuthSession(authService: AuthService) {
  return () => firstValueFrom(authService.tryRestoreSession().pipe(catchError(() => of(null))));
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(
      withInterceptors([credentialsInterceptor, authInterceptor]),
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',
        headerName: 'X-XSRF-TOKEN',
      })),
      {
      provide: APP_INITIALIZER,
      useFactory: initAuthSession,
      deps: [AuthService],
      multi: true,
    },
  ],
};