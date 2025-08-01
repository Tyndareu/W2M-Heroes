import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Hero } from '../../interfaces/hero.interface';
import { HeroImagePipe } from '../../pipes/hero-image.pipe';

@Component({
  selector: 'app-heroes-card',
  imports: [CommonModule, HeroImagePipe, MatButtonModule, MatCardModule],
  templateUrl: './heroes-card.component.html',
})
export class HeroesCardComponent {
  public heroes = input.required<Hero[]>();
  readonly deleteHero = output<Hero>();
  readonly updateAndNavigateHero = output<Hero>();
}
