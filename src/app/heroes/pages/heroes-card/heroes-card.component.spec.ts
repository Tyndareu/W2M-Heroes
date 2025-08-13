import { ComponentFixture, TestBed } from '@angular/core/testing';

import { By } from '@angular/platform-browser';
import { Hero } from '../../interfaces/hero.interface';
import { HeroImagePipe } from '../../pipes/hero-image.pipe';
import { HeroesCardComponent } from './heroes-card.component';

describe('HeroesCardComponent', () => {
  let component: HeroesCardComponent;
  let fixture: ComponentFixture<HeroesCardComponent>;

  const mockHero: Hero = {
    id: '1',
    superhero: 'Superman',
    publisher: 'DC Comics',
    alter_ego: 'Clark Kent',
    first_appearance: 'Action Comics #1',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroesCardComponent, HeroImagePipe],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroesCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('heroes', [mockHero]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display hero information', () => {
    const cardTitle = fixture.debugElement.query(
      By.css('mat-card-title')
    ).nativeElement;
    const cardSubtitle = fixture.debugElement.query(
      By.css('mat-card-subtitle')
    ).nativeElement;

    expect(cardTitle.textContent).toContain(mockHero.superhero);
    expect(cardSubtitle.textContent).toContain(mockHero.alter_ego);
  });
});
