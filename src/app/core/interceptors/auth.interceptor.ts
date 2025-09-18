import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment.local';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  let modifiedReq = req;

  if (
    req.url.startsWith(`${environment.apiBaseUrl}/agents`) ||
    req.url.startsWith(`${environment.apiBaseUrl}/real-estates`)
  ) {
    modifiedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${environment.apiToken}`
      }
    });
  }

  return next(modifiedReq);
};
