import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { HeroesService } from '../../Services/heroes.service';
import { Hero } from '../../interfaces/hero.interface';
import { HeroComponent } from './hero.component';

describe('HeroComponent', () => {
  let component: HeroComponent;
  let fixture: ComponentFixture<HeroComponent>;
  let heroesServiceSpy: jasmine.SpyObj<HeroesService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const heroesService = jasmine.createSpyObj('HeroesService', [
      'newHero',
      'updateHero',
      'selectedHeroWithGetById',
    ]);

    const router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HeroComponent],
      providers: [
        { provide: HeroesService, useValue: heroesService },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    heroesServiceSpy = TestBed.inject(
      HeroesService
    ) as jasmine.SpyObj<HeroesService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroComponent);
    component = fixture.componentInstance;
    // Mock the heroID input signal
    fixture.componentRef.setInput('heroID', '1');
    // Prevent the effect from running during setup
    spyOn(component, 'loadHero');
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

    // Remove the spy from beforeEach and call loadHero directly
    (component.loadHero as jasmine.Spy).and.callThrough();
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

    heroesServiceSpy.updateHero.and.returnValue(of(mockHero));
    routerSpy.navigate.and.returnValue(Promise.resolve(true));

    component.heroForm.patchValue(mockHero);
    component.onSubmit();

    const expectedHero = {
      ...mockHero,
      superhero: 'Test Superhero', // Title case conversion
      id: '1', // Should keep existing ID
    };

    expect(heroesServiceSpy.updateHero).toHaveBeenCalledWith(expectedHero);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/heroes/heroes-list']);
  });
  it('should call newHero when submitting valid form for a new hero', () => {
    // Set heroID to 'new' for new hero scenario
    fixture.componentRef.setInput('heroID', 'new');

    const mockHero: Hero = {
      id: '',
      img: 'hero-img-url',
      superhero: 'test superhero',
      publisher: 'Test Publisher',
      alter_ego: 'Test Alter Ego',
      first_appearance: 'Test First Appearance',
      alt_img: 'test-alt-img-url',
    };

    heroesServiceSpy.newHero.and.returnValue(of(mockHero));
    routerSpy.navigate.and.returnValue(Promise.resolve(true));

    // Mock crypto.randomUUID
    spyOn(crypto, 'randomUUID').and.returnValue(
      '550e8400-e29b-41d4-a716-446655440000'
    );

    component.heroForm.patchValue(mockHero);
    component.onSubmit();

    const expectedHero = {
      ...mockHero,
      superhero: 'Test Superhero', // Title case conversion
      id: '550e8400-e29b-41d4-a716-446655440000', // Should generate new UUID
    };

    expect(heroesServiceSpy.newHero).toHaveBeenCalledWith(expectedHero);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/heroes/heroes-list']);
  });

  it('should not call any service and not navigate if the form is invalid', () => {
    // Make form invalid by clearing required field
    component.heroForm.get('superhero')?.setValue('');
    component.heroForm.get('superhero')?.markAsTouched();

    component.onSubmit();

    expect(heroesServiceSpy.newHero).not.toHaveBeenCalled();
    expect(heroesServiceSpy.updateHero).not.toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });
});
