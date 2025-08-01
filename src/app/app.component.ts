import { Component, OnInit, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingComponent } from './core/components/loading/loading.component';
import { LoadingService } from './shared/services/loading/loading.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoadingComponent],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  private readonly loadingService = inject(LoadingService);

  title = 'W2M';
  public isLoading = signal(false);

  ngOnInit(): void {
    this.setIsLoading();
  }

  private setIsLoading(): void {
    this.loadingService.isLoadingSubject$.subscribe({
      next: value => this.isLoading.set(value),
    });
  }
}
