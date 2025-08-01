import { CommonModule } from '@angular/common';
import { Component, Input, output } from '@angular/core';
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
  @Input() public heroes?: Hero[];
  readonly deleteHero = output<Hero>();
  readonly updateAndNavigateHero = output<Hero>();
  readonly getAllHeroes = output<void>();

  public onDeleteHero(hero: Hero): void {
    this.deleteHero.emit(hero);
  }

  public onUpdateAndNavigateHero(hero: Hero): void {
    this.updateAndNavigateHero.emit(hero);
  }

  public onGetAllHeroes(): void {
    this.getAllHeroes.emit();
  }
}
