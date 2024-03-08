import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
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
import { RouterLink } from '@angular/router';
import { debounceTime, map } from 'rxjs';
import { DialogConfirmComponent } from '../../../shared/components/dialog-confirm/dialog-confirm.component';
import { Hero } from '../../interfaces/hero.interface';
import { HeroImagePipe } from '../../pipes/hero-image.pipe';
import { HeroesService } from './../../Services/heroes.service';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeroImagePipe,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './search-page.component.html',
})
export class SearchPageComponent implements OnInit {
  public searchInput = new FormControl('');
  public heroes = signal<Hero[]>([]);
  public selectedHero = signal<Hero | undefined>(undefined);

  private destroyRef = inject(DestroyRef);

  constructor(
    private heroesService: HeroesService,
    private dialog: MatDialog,
    private heroService: HeroesService
  ) {}

  ngOnInit(): void {
    this.searchHero();
  }

  private searchHero(): void {
    this.searchInput.valueChanges
      .pipe(
        debounceTime(500),
        map(value => value as string),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((value: string) => {
        this.heroesService.getSearchHeroes(value).subscribe({
          next: heroes => {
            this.heroes.set(heroes);
          },
        });
      });
  }

  public onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    if (!event.option.value) {
      this.selectedHero.set(undefined);
    }
    const hero: Hero = event.option.value;
    this.searchInput.setValue(hero.superhero);
    this.selectedHero.set(hero);
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
        this.heroService.deleteHero(hero).subscribe({
          next: () => {
            this.selectedHero.set(undefined);
            this.searchInput.setValue('');
          },
        });
      }
    });
  }
  public clearSearchInput(): void {
    this.searchInput.setValue('');
    this.selectedHero.set(undefined);
  }
}