import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../../shared/services/loading.service';

/**
 * Interceptor to show and hide a loading indicator for HTTP requests.
 */
@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  // Service for managing the loading state.
  private readonly _loadingService = inject(LoadingService);

  // URLs to exclude from showing the loading indicator.
  private readonly _excludedUrls: string[] = ['/heroes?q'];

  /**
   * Intercepts HTTP requests to show and hide a loading indicator.
   * @param req The outgoing HTTP request.
   * @param next The next interceptor in the chain.
   * @returns An Observable of the HTTP event.
   */
  intercept<T>(
    req: HttpRequest<T>,
    next: HttpHandler
  ): Observable<HttpEvent<T>> {
    const cloneReq = req.clone();
    if (this._isExcludedUrl(cloneReq.url)) {
      return next.handle(cloneReq);
    }
    this._loadingService.showLoader();
    return next.handle(cloneReq).pipe(
      finalize(() => {
        this._loadingService.hideLoader();
      })
    );
  }

  /**
   * Checks if a given URL is in the list of excluded URLs.
   * @param url The URL to check.
   * @returns True if the URL is excluded, false otherwise.
   */
  private _isExcludedUrl(url: string): boolean {
    return this._excludedUrls.some(excludedUrl => url.includes(excludedUrl));
  }
}
