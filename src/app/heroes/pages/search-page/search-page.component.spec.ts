/* eslint-disable @typescript-eslint/no-unused-vars */
import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { HeroesService } from '../../Services/heroes.service';
import { Hero } from '../../interfaces/hero.interface';
import { HeroImagePipe } from '../../pipes/hero-image.pipe';
import { SearchPageComponent } from './search-page.component';

describe('SearchPageComponent', () => {
  let component: SearchPageComponent;
  let fixture: ComponentFixture<SearchPageComponent>;
  let heroesServiceSpy: jasmine.SpyObj<HeroesService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const heroesService = jasmine.createSpyObj('HeroesService', [
      'getSearchHeroes',
      'deleteHero',
      'setSelectedHero',
    ]);
    const dialog = jasmine.createSpyObj('MatDialog', ['open']);
    const router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        HeroImagePipe,
        MatAutocompleteModule,
        MatButtonModule,
        MatCardModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressSpinnerModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: HeroesService, useValue: heroesService },
        { provide: MatDialog, useValue: dialog },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    TestBed.configureTestingModule({
      imports: [CommonModule],
      providers: [SearchPageComponent],
    });

    fixture = TestBed.createComponent(SearchPageComponent);
    component = fixture.componentInstance;
    heroesServiceSpy = TestBed.inject(
      HeroesService
    ) as jasmine.SpyObj<HeroesService>;
    dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to hero detail page when updateAndNavigateHero is called', () => {
    const hero: Hero = { id: '1', superhero: 'Superhero 1' };
    component.updateAndNavigateHero(hero);
    expect(heroesServiceSpy.setSelectedHero).toHaveBeenCalledWith(hero);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/heroes/hero', hero.id]);
  });
});
