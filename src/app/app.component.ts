import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingComponent } from './core/components/loading/loading.component';
import { LoadingService } from './shared/services/loading.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoadingComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  // Service for managing the loading state.
  private readonly _loadingService = inject(LoadingService);

  // Signal indicating if the application is loading.
  public isLoading = this._loadingService.$isLoading;
}
