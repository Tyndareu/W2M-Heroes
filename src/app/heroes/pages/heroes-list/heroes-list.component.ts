import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { debounceTime, map, tap } from 'rxjs';
import { DialogConfirmComponent } from '../../../shared/components/dialog-confirm/dialog-confirm.component';
import { HeroesService } from '../../Services/heroes.service';
import { Hero } from '../../interfaces/hero.interface';
import { HeroesCardComponent } from '../heroes-card/heroes-card.component';

@Component({
  selector: 'app-search-page',
  imports: [
    FormsModule,
    HeroesCardComponent,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './heroes-list.component.html',
})
export class HeroesListComponent implements OnInit {
  // Service for managing heroes.
  private readonly _heroesService = inject(HeroesService);
  // Service for opening dialogs.
  private readonly _dialog = inject(MatDialog);
  // Reference to the component's lifecycle for destruction.
  private readonly _destroyRef = inject(DestroyRef);
  // Angular router for navigation.
  private readonly _router = inject(Router);

  // Form control for the search input.
  public searchInput = new FormControl('');
  // Signal holding the list of heroes matching the search.
  public heroes = signal<Hero[]>([]);
  // Signal holding all heroes.
  public allHeroes = signal<Hero[] | undefined>(undefined);
  // Signal holding the currently selected hero.
  public selectedHero = signal<Hero | undefined>(undefined);
  // Signal indicating if the component is loading data.
  public isLoading = signal(false);

  // Time in milliseconds for debouncing the search input.
  private readonly _debounceTime = 500;

  /**
   * Initializes the component.
   */
  ngOnInit(): void {
    this.setupSearchInputListener();
    this.getAllHeroes();
  }

  /**
   * Gets all heroes and sets them in the allHeroes signal.
   */
  public getAllHeroes(): void {
    this._heroesService
      .getHeroes(null)
      .subscribe(heroes => this.allHeroes.set(heroes));
  }

  /**
   * Handles the selection of an option in the autocomplete.
   * @param event The autocomplete selection event.
   */
  public onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    const hero: Hero = event.option.value;
    if (!hero) {
      return;
    }
    this.searchInput.setValue(hero.superhero);
    this.selectedHero.set(hero);
  }

  /**
   * Clears the search input and related signals.
   */
  public clearSearchInput(): void {
    this.searchInput.setValue('');
    this.selectedHero.set(undefined);
    this.heroes.set([]);
  }

  /**
   * Sets the selected hero and navigates to the hero's page.
   * @param hero The hero to navigate to.
   */
  public updateAndNavigateHero(hero: Hero): void {
    this._heroesService.setSelectedHero(hero);
    this._router.navigate(['/heroes/hero', hero.id]);
  }

  /**
   * Opens a confirmation dialog and deletes the hero if confirmed.
   * @param hero The hero to delete.
   */
  public deleteHero(hero: Hero): void {
    const dialogRef = this._dialog.open(DialogConfirmComponent, {
      data: {
        title: 'Delete superhero',
        text: 'Are you sure you want to delete this super hero?',
        name: hero.superhero,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._heroesService.deleteHero(hero).subscribe({
          next: () => {
            this.selectedHero.set(undefined);
            this.searchInput.setValue('');
            this.getAllHeroes();
          },
        });
      }
    });
  }

  /**
   * Sets up a listener for the search input value changes.
   */
  private setupSearchInputListener(): void {
    this.searchInput.valueChanges
      .pipe(
        tap(() => {
          this.isLoading.set(true);
          this.selectedHero.set(undefined);
        }),
        debounceTime(this._debounceTime),
        map(value => value as string),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe((value: string) => {
        if (value === '') {
          return;
        }
        this._heroesService.getHeroes(value).subscribe({
          next: heroes => {
            this.heroes.set(heroes);
            this.isLoading.set(false);
          },
          error: () => this.isLoading.set(false),
        });
      });
  }
}
