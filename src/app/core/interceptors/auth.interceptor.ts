import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment.local';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  if (
    req.url.startsWith(`${environment.apiBaseUrl}/agents`) ||
    req.url.startsWith(`${environment.apiBaseUrl}/real-estates`)
  ) {
    return from(authService.getIdToken()).pipe(
      switchMap((firebaseToken) => {
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
