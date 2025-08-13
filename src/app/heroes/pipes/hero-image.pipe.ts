import { Pipe, PipeTransform } from '@angular/core';
import { Hero } from '../interfaces/hero.interface';

/**
 * Pipe to determine the correct image source for a hero.
 */
@Pipe({
  name: 'heroImage',
  standalone: true,
})
export class HeroImagePipe implements PipeTransform {
  /**
   * Transforms a Hero object into its image URL.
   * Returns a default 'no-image.png' if no image or alt_img is provided.
   * @param hero The Hero object.
   * @returns The URL of the hero's image.
   */
  transform(hero: Hero): string {
    if (!hero.img && !hero.alt_img) {
      return 'assets/no-image.png';
    }
    return hero.alt_img || `assets/heroes/${hero.img}.jpg`;
  }
}
