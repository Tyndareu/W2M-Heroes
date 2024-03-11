import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { DialogConfirmComponent } from '../../../shared/components/dialog-confirm/dialog-confirm.component';
import { HeroesService } from '../../Services/heroes.service';
import { HeroesCardComponent } from '../heroes-card/heroes-card.component';
import { HeroesListComponent } from './heroes-list.component';

describe('HeroesListComponent', () => {
  let component: HeroesListComponent;
  let fixture: ComponentFixture<HeroesListComponent>;
  let heroesServiceSpy: jasmine.SpyObj<HeroesService>;
  let dialog: MatDialog;
  const mockHeroes = [{ id: '1', superhero: 'Hero 1' }];

  beforeEach(async () => {
    heroesServiceSpy = jasmine.createSpyObj('HeroesService', [
      'getHeroes',
      'deleteHero',
      'setSelectedHero',
    ]);
    heroesServiceSpy.getHeroes.and.returnValue(of(mockHeroes));
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
      providers: [{ provide: HeroesService, useValue: heroesServiceSpy }],
    }).compileComponents();

    dialog = TestBed.inject(MatDialog);
    const dialogRef = {
      afterClosed: () => of(),
    } as unknown as MatDialogRef<unknown, unknown>;
    spyOn(dialog, 'open').and.returnValue(dialogRef);

    heroesServiceSpy = TestBed.inject(
      HeroesService
    ) as jasmine.SpyObj<HeroesService>;
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

  it('should delete a hero', () => {
    const mockDeleteHero = { id: '1', superhero: 'Hero 1' };
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    dialogRefSpy.afterClosed.and.callFake(() => of(true));

    (dialog.open as jasmine.Spy).and.returnValue(dialogRefSpy);

    heroesServiceSpy.deleteHero.and.returnValue(of(mockDeleteHero));

    component.deleteHero(mockDeleteHero);

    expect(dialog.open).toHaveBeenCalledWith(DialogConfirmComponent, {
      data: {
        title: 'Delete superhero',
        text: 'Are you sure you want to delete this super hero?',
        name: mockDeleteHero.superhero,
      },
    });
    expect(heroesServiceSpy.deleteHero).toHaveBeenCalledWith(mockDeleteHero);
    expect(component.selectedHero()).toBeUndefined();
    expect(component.searchInput.value).toBe('');
  });

  it('should not call getHeroes if search input is empty after debounce', () => {
    component.searchInput.setValue('test');

    setTimeout(() => {
      expect(heroesServiceSpy.getHeroes).toHaveBeenCalledTimes(1);
      expect(heroesServiceSpy.getHeroes).toHaveBeenCalledWith('test');

      component.searchInput.setValue('');

      setTimeout(() => {
        expect(heroesServiceSpy.getHeroes).toHaveBeenCalledTimes(1);
      }, 500);
    }, 500);
  });
  it('should call getHeroes with search input value after debounce', () => {
    component.searchInput.setValue('ironman');

    setTimeout(() => {
      expect(heroesServiceSpy.getHeroes).toHaveBeenCalledTimes(1);
      expect(heroesServiceSpy.getHeroes).toHaveBeenCalledWith('ironman');
    }, 500);
  });
  it('should not set selectedHero if no hero is provided', () => {
    const event = {
      option: {
        value: null,
      },
    } as MatAutocompleteSelectedEvent;

    const setValueSpy = spyOn(
      component.searchInput,
      'setValue'
    ).and.callThrough();
    const setHeroSpy = spyOn(component.selectedHero, 'set');

    component.onOptionSelected(event);

    expect(setValueSpy).not.toHaveBeenCalled();
    expect(setHeroSpy).not.toHaveBeenCalled();
  });
  it('should call getHeroes service method when value is not empty', fakeAsync(() => {
    const value = 'Superman';
    const mockHeroes = [{ id: '1', superhero: 'Superman' }];
    const getHeroesSpy = heroesServiceSpy.getHeroes.and.returnValue(
      of(mockHeroes)
    );
    component.searchInput.setValue(value);
    tick(501);
    expect(getHeroesSpy).toHaveBeenCalledWith(value);
  }));
});
