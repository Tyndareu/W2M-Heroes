/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class CRUDResponseInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const method = request.method.toUpperCase();

    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          const url = event.url;
          console.log(`${method} request to ${url} succeeded.`);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        const url = error.url;
        if (error.error instanceof ErrorEvent) {
          // Client-side error
          console.error(
            `Error in ${method} request to ${url}: ${error.error.message}`
          );
        } else {
          // Server-side error
          console.error(
            `Error in ${method} request to ${url}: ${error.status} ${error.statusText}`
          );
        }
        return throwError(() => error);
      })
    );
  }
}
