/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading/loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private loadingService: LoadingService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    console.log('entra');
    this.loadingService.showLoader();
    return next.handle(req).pipe(
      finalize(() => {
        console.log('sale');
        this.loadingService.hideLoader();
      })
    );
  }
}
