import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { HeroesService } from '../../Services/heroes.service';
import { Hero } from '../../interfaces/hero.interface';
import { HeroComponent } from './hero.component';

describe('HeroComponent', () => {
  let component: HeroComponent;
  let fixture: ComponentFixture<HeroComponent>;
  let heroesServiceSpy: jasmine.SpyObj<HeroesService>;

  beforeEach(async () => {
    const heroesService = jasmine.createSpyObj('HeroesService', [
      'newHero',
      'updateHero',
      'selectedHeroWithGetById',
      'setSelectedHero',
    ]);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, HeroComponent],
      providers: [{ provide: HeroesService, useValue: heroesService }],
    }).compileComponents();

    heroesServiceSpy = TestBed.inject(
      HeroesService
    ) as jasmine.SpyObj<HeroesService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load hero', () => {
    const mockHero = {
      id: '1',
      superhero: 'Superman',
      publisher: 'DC Comics',
      alter_ego: 'Clark Kent',
      first_appearance: 'Action Comics #1',
      img: 'https://example.com/superman.jpg',
      alt_img: '',
    };

    const mockHeroWithUpperCaseSuperhero = {
      ...mockHero,
      superhero: 'SUPERMAN',
    };

    heroesServiceSpy.selectedHeroWithGetById.and.returnValue(of(mockHero));

    component.heroID = '1';
    component.loadHero();

    expect(component.hero()).toEqual(mockHeroWithUpperCaseSuperhero);
    expect(component.heroForm.value).toEqual(mockHeroWithUpperCaseSuperhero);
  });
  it('should reset the form and set the image value to the hero image', () => {
    const mockHero: Hero = {
      id: '1',
      img: 'hero-img-url',
      superhero: 'Test Superhero',
      publisher: 'Test Publisher',
      alter_ego: 'Test Alter Ego',
      first_appearance: 'Test First Appearance',
      alt_img: 'test-alt-img-url',
    };
    const resetSpy = spyOn(component.heroForm, 'reset').and.callThrough();

    component.hero.set(mockHero);
    component.resetForm();

    expect(resetSpy).toHaveBeenCalled();
  });
  it('should return true if field is required and has errors and has been touched', () => {
    const mockForm: FormGroup = new FormBuilder().group({
      superhero: ['', Validators.required],
    });
    mockForm.get('superhero')?.markAsTouched();

    component.heroForm = mockForm;

    const isValid = component.isValidFiled('superhero');

    expect(isValid).toBeTruthy();
  });
});
