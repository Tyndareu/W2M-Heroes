import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { DialogConfirmComponent } from '../../../shared/components/dialog-confirm/dialog-confirm.component';
import { HeroesService } from '../../Services/heroes.service';
import { Hero } from '../../interfaces/hero.interface';
import { HeroImagePipe } from '../../pipes/hero-image.pipe';

@Component({
  selector: 'app-heroes-list',
  standalone: true,
  imports: [
    CommonModule,
    HeroImagePipe,
    MatButtonModule,
    MatCardModule,
    RouterLink,
  ],
  templateUrl: './heroes-list.component.html',
})
export class HeroesListComponent implements OnInit {
  public heroes = signal<Hero[] | null>(null);

  private destroyRef = inject(DestroyRef);

  constructor(
    private heroService: HeroesService,
    private dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.getHeroes();
  }

  public getHeroes(): void {
    this.heroService
      .getHeroes()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: heroes => this.heroes.set(heroes),
      });
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
        this.heroService
          .deleteHero(hero)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              this.getHeroes();
            },
          });
      }
    });
  }
}
