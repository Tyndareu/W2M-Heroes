import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Hero } from '../../interfaces/hero.interface';
import { HeroImagePipe } from '../../pipes/hero-image.pipe';

/**
 * Component for displaying a card with hero information.
 */
@Component({
  selector: 'app-heroes-card',
  imports: [CommonModule, HeroImagePipe, MatButtonModule, MatCardModule],
  templateUrl: './heroes-card.component.html',
})
export class HeroesCardComponent {
  /** Input property for the list of heroes to display. */
  public heroes = input.required<Hero[]>();

  /** Output event for deleting a hero. */
  readonly deleteHero = output<Hero>();

  /** Output event for updating and navigating to a hero. */
  readonly updateAndNavigateHero = output<Hero>();
}
