import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Hero } from '../../interfaces/hero.interface';
import { HeroImagePipe } from '../../pipes/hero-image.pipe';

@Component({
  selector: 'app-heroes-card',
  standalone: true,
  imports: [CommonModule, HeroImagePipe, MatButtonModule, MatCardModule],

  templateUrl: './heroes-card.component.html',
})
export class HeroesCardComponent {
  @Input() public heroes?: Hero[];
  @Output() deleteHero = new EventEmitter<Hero>();
  @Output() updateAndNavigateHero = new EventEmitter<Hero>();
  @Output() getAllHeroes = new EventEmitter<Hero>();

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
