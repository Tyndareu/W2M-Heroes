import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  public isLoadingSubject$ = new BehaviorSubject<boolean>(false);

  public showLoader(): void {
    this.isLoadingSubject$.next(true);
  }

  public hideLoader(): void {
    this.isLoadingSubject$.next(false);
  }
}
