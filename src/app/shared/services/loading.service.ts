import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  public $isLoading = signal(false);

  public showLoader(): void {
    this.$isLoading.set(true);
  }

  public hideLoader(): void {
    this.$isLoading.set(false);
  }
}
