import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
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

  constructor(private heroService: HeroesService) {}
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
    this.heroService.deleteHero(hero.id).subscribe({
      next: () => this.getHeroes(),
    });
  }
}
