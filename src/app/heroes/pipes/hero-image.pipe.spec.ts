import { HeroImagePipe } from './hero-image.pipe';
import { Hero } from '../interfaces/hero.interface';

describe('HeroImagePipe', () => {
  let pipe: HeroImagePipe;

  beforeEach(() => {
    pipe = new HeroImagePipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return default image path when both img and alt_img are not available', () => {
    const hero: Hero = { id: '1', superhero: 'Test Hero' };
    expect(pipe.transform(hero)).toEqual('assets/no-image.png');
  });

  it('should return alt_img when available', () => {
    const hero: Hero = {
      id: '1',
      superhero: 'Test Hero',
      alt_img: 'test-alt-img.png',
    };
    expect(pipe.transform(hero)).toEqual('test-alt-img.png');
  });

  it('should return img path when img is available and alt_img is not', () => {
    const hero: Hero = { id: '1', superhero: 'Test Hero', img: 'test-img' };
    expect(pipe.transform(hero)).toEqual('assets/heroes/test-img.jpg');
  });

  it('should prioritize alt_img over img when both are available', () => {
    const hero: Hero = {
      id: '1',
      superhero: 'Test Hero',
      img: 'test-img',
      alt_img: 'test-alt-img.png',
    };
    expect(pipe.transform(hero)).toEqual('test-alt-img.png');
  });
});
