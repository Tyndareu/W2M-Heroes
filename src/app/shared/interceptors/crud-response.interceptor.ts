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
  /** Material Design snackbar service for displaying notifications */
  private readonly _snackBar = inject(MatSnackBar);

  /** Default configuration for snackbar notifications */
  private readonly _snackbarConfig: MatSnackBarConfig = {
    verticalPosition: 'top',
    horizontalPosition: 'right',
    duration: 3000,
  };

  /**
   * Intercepts HTTP requests and responses to provide user feedback.
   *
   * @template T - The type of the request body
   * @param req - The outgoing HTTP request
   * @param next - The next handler in the interceptor chain
   * @returns Observable of HTTP events with success/error handling
   */
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

  /**
   * Displays success snackbar messages for successful HTTP operations.
   * GET requests are excluded from success notifications.
   *
   * @param method - The HTTP method (GET, POST, PUT, DELETE, etc.)
   * @private
   */
  private _showSuccessSnackbar(method: string): void {
    const messages: { [key: string]: string } = {
      put: 'Data has been updated successfully.',
      post: 'Data has been created successfully.',
      delete: 'Data has been deleted successfully.',
    };

    const message =
      messages[method.toLowerCase()] ||
      `The ${method} request has been successful.`;

    if (method !== 'GET') {
      this._showSnackbar(message, 'snackbar-success');
    }
  }

  /**
   * Displays error snackbar messages for failed HTTP operations.
   *
   * @param method - The HTTP method that failed
   * @param errorMessage - The error message to display
   * @private
   */
  private _showErrorSnackbar(method: string, errorMessage: string): void {
    const messagePrefixes: { [key: string]: string } = {
      get: 'An error occurred while retrieving data:',
      put: 'An error occurred while updating data:',
      post: 'An error occurred while creating data:',
      delete: 'An error occurred while deleting data:',
    };

    const prefix =
      messagePrefixes[method.toLowerCase()] ||
      `An error occurred during the ${method} request:`;
    this._showSnackbar(`${prefix} ${errorMessage}`, 'snackbar-error');
  }

  /**
   * Displays a snackbar notification with the specified message and styling.
   *
   * @param message - The message to display in the snackbar
   * @param panelClass - CSS class for styling (e.g., 'snackbar-success', 'snackbar-error')
   * @private
   */
  private _showSnackbar(message: string, panelClass: string): void {
    const config: MatSnackBarConfig = {
      ...this._snackbarConfig,
      panelClass: [panelClass],
    };
    this._snackBar.open(message, 'Close', config);
  }

  /**
   * Extracts a user-friendly error message from an HTTP error response.
   *
   * @param error - The HTTP error response
   * @returns A formatted error message string
   * @private
   */
  private _getErrorMessage(error: HttpErrorResponse): string {
    return error.error instanceof ErrorEvent
      ? error.error.message
      : `${error.status} ${error.statusText}`;
  }
}
