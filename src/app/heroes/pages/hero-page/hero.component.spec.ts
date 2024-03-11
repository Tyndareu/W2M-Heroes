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
    const mockHero: Hero = {
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

    const isValid = component.isValidField('superhero');

    expect(isValid).toBeTruthy();
  });
  it('should mark all form fields as touched if form is invalid', () => {
    component.heroForm.get('superhero')?.setValue('');
    const markAllAsTouchedSpy = spyOn(component.heroForm, 'markAllAsTouched');

    component.onSubmit();

    expect(markAllAsTouchedSpy).toHaveBeenCalled();
  });
  it('should call updateHero when submitting valid form for an existing hero', () => {
    const mockHero: Hero = {
      id: '1',
      img: 'hero-img-url',
      superhero: 'Test Superhero',
      publisher: 'Test Publisher',
      alter_ego: 'Test Alter Ego',
      first_appearance: 'Test First Appearance',
      alt_img: 'test-alt-img-url',
    };
    const updateHeroSpy = heroesServiceSpy.updateHero.and.returnValue(
      of(mockHero)
    );
    const navigateSpy = spyOn(component['router'], 'navigate').and.returnValue(
      Promise.resolve(true)
    );
    component.heroID = '1';
    component.heroForm.patchValue(mockHero);
    component.onSubmit();
    expect(updateHeroSpy).toHaveBeenCalledWith(mockHero);
    expect(navigateSpy).toHaveBeenCalledWith(['/heroes/heroes-list']);
  });
  it('should call newHero when submitting valid form for a new hero', () => {
    const mockHero: Hero = {
      id: '',
      img: 'hero-img-url',
      superhero: 'Test Superhero',
      publisher: 'Test Publisher',
      alter_ego: 'Test Alter Ego',
      first_appearance: 'Test First Appearance',
      alt_img: 'test-alt-img-url',
    };
    const newHeroSpy = heroesServiceSpy.newHero.and.returnValue(of(mockHero));
    const navigateSpy = spyOn(component['router'], 'navigate').and.returnValue(
      Promise.resolve(true)
    );

    component.heroForm.patchValue(mockHero);
    component.heroID = 'new';
    component.onSubmit();
    expect(newHeroSpy).toHaveBeenCalled;
    expect(navigateSpy).toHaveBeenCalledWith(['/heroes/heroes-list']);
  });

  it('should not call any service and not navigate if the form is invalid', () => {
    const invalidForm: FormGroup = new FormBuilder().group({
      superhero: ['', Validators.required],
    });
    component.heroForm = invalidForm;
    component.onSubmit();
    expect(heroesServiceSpy.newHero).not.toHaveBeenCalled();
    expect(heroesServiceSpy.updateHero).not.toHaveBeenCalled();
  });
});
