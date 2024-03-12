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

  intercept<T>(
    req: HttpRequest<T>,
    next: HttpHandler
  ): Observable<HttpEvent<T>> {
    const cloneReq = req.clone();
    if (this.isExcludedUrl(cloneReq.url)) {
      return next.handle(cloneReq);
    }
    this.loadingService.showLoader();
    return next.handle(cloneReq).pipe(
      finalize(() => {
        this.loadingService.hideLoader();
      })
    );
  }
  private isExcludedUrl(url: string): boolean {
    return this.excludedUrls.some(excludedUrl => url.includes(excludedUrl));
  }
}
