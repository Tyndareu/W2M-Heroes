import { Component, DestroyRef, OnInit, signal, inject } from '@angular/core';
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
import { debounceTime, map, take, tap } from 'rxjs';
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
  private readonly heroesService = inject(HeroesService);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  public searchInput = new FormControl('');
  public heroes = signal<Hero[]>([]);
  public allHeroes = signal<Hero[] | null>(null);
  public selectedHero = signal<Hero | undefined>(undefined);
  public isLoading = signal(false);

  private readonly debounceTime = 500;

  ngOnInit(): void {
    this.getAllHeroes();
    this.setupSearchInputListener();
  }

  public getAllHeroes(): void {
    this.heroesService
      .getHeroes(null)
      .pipe(take(1))
      .subscribe({
        next: heroes => {
          this.allHeroes.set(heroes);
        },
      });
  }

  public onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    const hero: Hero = event.option.value;
    if (!hero) {
      return;
    }
    this.searchInput.setValue(hero.superhero);
    this.selectedHero.set(hero);
  }

  public clearSearchInput(): void {
    this.searchInput.setValue('');
    this.selectedHero.set(undefined);
    this.heroes.set([]);
  }

  public updateAndNavigateHero(hero: Hero): void {
    this.heroesService.setSelectedHero(hero);
    this.router.navigate(['/heroes/hero', hero.id]);
  }

  public deleteHero(hero: Hero): void {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: {
        title: 'Delete superhero',
        text: 'Are you sure you want to delete this super hero?',
        name: hero.superhero,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.heroesService.deleteHero(hero).subscribe({
          next: () => {
            this.getAllHeroes();
            this.selectedHero.set(undefined);
            this.searchInput.setValue('');
          },
        });
      }
    });
  }

  private setupSearchInputListener(): void {
    this.searchInput.valueChanges
      .pipe(
        tap(() => {
          this.isLoading.set(true);
          this.selectedHero.set(undefined);
        }),
        debounceTime(this.debounceTime),
        map(value => value as string),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((value: string) => {
        if (value === '') {
          return;
        }
        this.heroesService.getHeroes(value).subscribe({
          next: heroes => {
            this.heroes.set(heroes);
            this.isLoading.set(false);
          },
          error: () => this.isLoading.set(false),
        });
      });
  }
}
