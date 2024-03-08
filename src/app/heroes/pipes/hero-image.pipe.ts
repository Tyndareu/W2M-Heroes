import { Pipe, PipeTransform } from '@angular/core';
import { Hero } from '../interfaces/hero.interface';

@Pipe({
  name: 'heroImage',
  standalone: true,
})
export class HeroImagePipe implements PipeTransform {
  transform(hero: Hero): string {
    if (!hero.img && !hero.alt_img) {
      return 'assets/no-image.png';
    }
    return hero.alt_img || `assets/heroes/${hero.img}.jpg`;
  }
}
