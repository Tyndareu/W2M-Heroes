import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { HeroesService } from '../../Services/heroes.service';
import { Hero } from '../../interfaces/hero.interface';
import { HeroImagePipe } from '../../pipes/hero-image.pipe';

@Component({
  selector: 'app-heroes-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, HeroImagePipe],
  templateUrl: './heroes-list.component.html',
})
export class HeroesListComponent implements OnInit {
  public heroes = signal<Hero[] | null>(null);

  constructor(private heroService: HeroesService) {}
  ngOnInit(): void {
    this.getHeroes();
  }

  public getHeroes(): void {
    this.heroService.getHeroes().subscribe({
      next: heroes => this.heroes.set(heroes),
    });
  }
}
