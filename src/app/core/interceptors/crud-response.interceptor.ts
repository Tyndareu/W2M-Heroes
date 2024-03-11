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
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class CRUDResponseInterceptor implements HttpInterceptor {
  constructor(private readonly snackBar: MatSnackBar) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const method = request.method.toUpperCase();

    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          this.showSnackbar(method, true);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        const errorMessage =
          error.error instanceof ErrorEvent
            ? error.error.message
            : `${error.status} ${error.statusText}`;

        this.showSnackbar(method, false, errorMessage);
        return throwError(() => error);
      })
    );
  }

  private showSnackbar(
    method: string,
    isSuccess: boolean,
    errorMessage?: string
  ): void {
    let message: string;

    if (isSuccess) {
      if (method === 'GET') {
        return;
      }

      switch (method) {
        case 'PUT':
          message = `Data has been updated successfully.`;
          break;
        case 'POST':
          message = `Data has been created successfully.`;
          break;
        case 'DELETE':
          message = `Data has been deleted successfully.`;
          break;
        default:
          message = `The ${method} request has been successful.`;
          break;
      }
    } else {
      switch (method) {
        case 'GET':
          message = `An error occurred while retrieving data:`;
          break;
        case 'PUT':
          message = `An error occurred while updating data:`;
          break;
        case 'POST':
          message = `An error occurred while creating data:`;
          break;
        case 'DELETE':
          message = `An error occurred while deleting data:`;
          break;
        default:
          message = `An error occurred during the ${method} request:`;
          break;
      }

      message += ` ${errorMessage}`;
    }

    this.snackBar.open(message, 'Close', {
      verticalPosition: 'top',
      horizontalPosition: 'right',
      duration: 3000,
      panelClass: [isSuccess ? 'snackbar-success' : 'snackbar-error'],
    });
  }
}
