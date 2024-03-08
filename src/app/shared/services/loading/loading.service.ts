import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  public isLoadingSubject = new BehaviorSubject<boolean>(false);

  public showLoader() {
    this.isLoadingSubject.next(true);
  }

  public hideLoader() {
    this.isLoadingSubject.next(false);
  }
}
