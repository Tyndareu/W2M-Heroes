import { Injectable, signal } from '@angular/core';

/**
 * Service for managing the application's loading state.
 */
@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  /** Signal indicating whether the application is currently loading. */
  public $isLoading = signal(false);

  /**
   * Shows the loading indicator.
   */
  public showLoader(): void {
    this.$isLoading.set(true);
  }

  /**
   * Hides the loading indicator.
   */
  public hideLoader(): void {
    this.$isLoading.set(false);
  }
}
