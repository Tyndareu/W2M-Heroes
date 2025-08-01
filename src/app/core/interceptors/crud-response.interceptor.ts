import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class CRUDResponseInterceptor implements HttpInterceptor {
  private readonly _snackBar = inject(MatSnackBar);

  private readonly _snackbarConfig: MatSnackBarConfig = {
    verticalPosition: 'top',
    horizontalPosition: 'right',
    duration: 3000,
  };

  intercept<T>(
    req: HttpRequest<T>,
    next: HttpHandler
  ): Observable<HttpEvent<T>> {
    const cloneReq = req.clone();

    const method = cloneReq.method.toUpperCase();
    return next.handle(cloneReq).pipe(
      tap((event: HttpEvent<T>) => {
        if (event instanceof HttpResponse) {
          this._showSuccessSnackbar(method);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        const errorMessage = this._getErrorMessage(error);
        this._showErrorSnackbar(method, errorMessage);
        return throwError(() => error);
      })
    );
  }

  private _showSuccessSnackbar(method: string): void {
    if (method === 'GET') {
      return;
    }

    let message: string;
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

    this._showSnackbar(message, 'snackbar-success');
  }

  private _showErrorSnackbar(method: string, errorMessage: string): void {
    let message: string;
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

    this._showSnackbar(message, 'snackbar-error');
  }

  private _showSnackbar(message: string, panelClass: string): void {
    this._snackbarConfig.panelClass = [panelClass];
    this._snackBar.open(message, 'Close', this._snackbarConfig);
  }

  private _getErrorMessage(error: HttpErrorResponse): string {
    return error.error instanceof ErrorEvent
      ? error.error.message
      : `${error.status} ${error.statusText}`;
  }
}
