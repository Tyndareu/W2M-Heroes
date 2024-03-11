/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../../shared/services/loading/loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private readonly excludedUrls: string[] = ['/heroes?q'];

  constructor(private readonly loadingService: LoadingService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.isExcludedUrl(req.url)) {
      return next.handle(req);
    }
    this.loadingService.showLoader();
    return next.handle(req).pipe(
      finalize(() => {
        this.loadingService.hideLoader();
      })
    );
  }
  private isExcludedUrl(url: string): boolean {
    return this.excludedUrls.some(excludedUrl => url.includes(excludedUrl));
  }
}
