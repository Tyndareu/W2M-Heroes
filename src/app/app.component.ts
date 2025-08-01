import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingComponent } from './core/components/loading/loading.component';
import { LoadingService } from './shared/services/loading/loading.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoadingComponent],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  private readonly _loadingService = inject(LoadingService);

  public title = 'W2M';
  public isLoading = signal(false);

  ngOnInit(): void {
    this._setIsLoading();
  }

  private _setIsLoading(): void {
    this._loadingService.isLoadingSubject$.subscribe({
      next: value => this.isLoading.set(value),
    });
  }
}
