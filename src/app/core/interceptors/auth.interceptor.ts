import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { from, switchMap, EMPTY } from 'rxjs';
import { environment } from '../../../environments/environment.local';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (
    req.url.startsWith(`${environment.apiBaseUrl}/agents`) ||
    req.url.startsWith(`${environment.apiBaseUrl}/real-estates`) ||
    req.url.startsWith(`${environment.apiBaseUrl}/regions`) ||
    req.url.startsWith(`${environment.apiBaseUrl}/cities`)
  ) {
    return from(authService.getIdToken()).pipe(
      switchMap((firebaseToken) => {
        if (!firebaseToken) {
          router.navigate(['/login']);
          return EMPTY;
        }

        const headers: { [key: string]: string } = {
          Authorization: `Bearer ${environment.apiToken}`
        };

        if (firebaseToken) {
          headers['X-Firebase-Token'] = firebaseToken;
        }

        const modifiedReq = req.clone({
          setHeaders: headers
        });

        return next(modifiedReq);
      })
    );
  }

  return next(req);
};
