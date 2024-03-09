import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Hero } from '../../interfaces/hero.interface';
import { HeroesCardComponent } from './heroes-card.component';

describe('HeroesCardComponent', () => {
  let component: HeroesCardComponent;
  let fixture: ComponentFixture<HeroesCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroesCardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit deleteHero event when onDeleteHero is called', () => {
    const mockHero: Hero = { id: '1', superhero: 'Test Hero' };
    const deleteSpy = spyOn(component.deleteHero, 'emit');

    component.onDeleteHero(mockHero);

    expect(deleteSpy).toHaveBeenCalledWith(mockHero);
  });

  it('should emit updateAndNavigateHero event when onUpdateAndNavigateHero is called', () => {
    const mockHero: Hero = { id: '1', superhero: 'Test Hero' };
    const updateSpy = spyOn(component.updateAndNavigateHero, 'emit');

    component.onUpdateAndNavigateHero(mockHero);

    expect(updateSpy).toHaveBeenCalledWith(mockHero);
  });

  it('should emit getAllHeroes event when onGetAllHeroes is called', () => {
    const getAllSpy = spyOn(component.getAllHeroes, 'emit');

    component.onGetAllHeroes();

    expect(getAllSpy).toHaveBeenCalled();
  });
});
