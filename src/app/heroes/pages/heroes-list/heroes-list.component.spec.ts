/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { HeroesService } from '../../Services/heroes.service';
import { HeroesCardComponent } from '../heroes-card/heroes-card.component';
import { HeroesListComponent } from './heroes-list.component';

describe('HeroesListComponent', () => {
  let component: HeroesListComponent;
  let fixture: ComponentFixture<HeroesListComponent>;
  let heroesServiceSpy: jasmine.SpyObj<HeroesService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  const mockHeroes = [{ id: '1', superhero: 'Hero 1' }];

  beforeEach(async () => {
    heroesServiceSpy = jasmine.createSpyObj('HeroesService', [
      'getHeroes',
      'deleteHero',
      'setSelectedHero',
    ]);
    heroesServiceSpy.getHeroes.and.returnValue(of(mockHeroes));

    const dialog = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HeroesCardComponent,
        HeroesListComponent,
        MatAutocompleteModule,
        MatButtonModule,
        MatCardModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressSpinnerModule,
        ReactiveFormsModule,
        RouterTestingModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: HeroesService, useValue: heroesServiceSpy },
        { provide: MatDialog, useValue: dialog },
      ],
    }).compileComponents();

    heroesServiceSpy = TestBed.inject(
      HeroesService
    ) as jasmine.SpyObj<HeroesService>;
    dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get all heroes', () => {
    heroesServiceSpy.getHeroes.and.returnValue(of(mockHeroes));

    component.getAllHeroes();

    expect(component.allHeroes()).toEqual(mockHeroes);
  });

  it('should set heroes and loading flag on search input change', () => {
    const searchInput = new FormControl('test');

    heroesServiceSpy.getHeroes.and.returnValue(of(mockHeroes));

    component.searchInput = searchInput;

    component.getHeroes();

    expect(component.isLoading()).toBeFalse();
  });

  it('should handle option selected event', () => {
    const event = {
      option: {
        value: { id: '1', superhero: 'Hero 1' },
      },
    } as MatAutocompleteSelectedEvent;

    component.onOptionSelected(event);

    expect(component.selectedHero()).toEqual(event.option.value);
    expect(component.searchInput.value).toEqual(event.option.value.superhero);
  });

  it('should clear search input and selected hero', () => {
    const searchInput = new FormControl('test');
    const selectedHero = { id: '1', superhero: 'Hero 1' };

    component.searchInput = searchInput;
    component.selectedHero.set(selectedHero);

    component.clearSearchInput();

    expect(component.searchInput.value).toEqual('');
    expect(component.selectedHero()).toBeUndefined();
    expect(component.heroes()).toEqual([]);
  });

  it('should update and navigate hero', () => {
    const hero = { id: '1', superhero: 'Hero 1' };

    component.updateAndNavigateHero(hero);

    expect(heroesServiceSpy.setSelectedHero).toHaveBeenCalledWith(hero);
  });
  it('should hide loading spinner after search completes', () => {
    const searchInput = new FormControl('test');
    component.searchInput = searchInput;

    heroesServiceSpy.getHeroes.and.returnValue(of(mockHeroes));

    component.getHeroes();

    expect(component.isLoading()).toBeFalse();
  });
});
