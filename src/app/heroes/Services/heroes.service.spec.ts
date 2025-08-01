import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { Hero } from '../interfaces/hero.interface';
import { HeroesService } from './heroes.service';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

describe('HeroesService', () => {
  let service: HeroesService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        HeroesService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(HeroesService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve heroes from the API via GET', () => {
    const dummyHeroes: Hero[] = [
      { id: '1', superhero: 'Hero 1' },
      { id: '2', superhero: 'Hero 2' },
    ];

    service.getHeroes(null).subscribe(heroes => {
      expect(heroes.length).toBe(2);
      expect(heroes).toEqual(dummyHeroes);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/heroes`);
    expect(req.request.method).toBe('GET');

    req.flush(dummyHeroes);
  });

  it('should retrieve search heroes from the API via GET', () => {
    const query = 'searchQuery';
    const dummyHeroes: Hero[] = [
      { id: '1', superhero: 'Hero 1' },
      { id: '2', superhero: 'Hero 2' },
    ];

    service.getHeroes(query).subscribe(heroes => {
      expect(heroes.length).toBe(2);
      expect(heroes).toEqual(dummyHeroes);
    });

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/heroes?q=${query}&_limit=8`
    );
    expect(req.request.method).toBe('GET');

    req.flush(dummyHeroes);
  });

  it('should retrieve selected hero by id from the API via GET', () => {
    const heroID = '1';
    const dummyHero: Hero = { id: heroID, superhero: 'Hero 1' };

    service.selectedHeroWithGetById(heroID).subscribe(hero => {
      expect(hero).toEqual(dummyHero);
    });

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/heroes/${heroID}`
    );
    expect(req.request.method).toBe('GET');

    req.flush(dummyHero);
  });

  it('should add a new hero to the API via POST', () => {
    const newHero: Hero = { id: '3', superhero: 'New Hero' };

    service.newHero(newHero).subscribe(hero => {
      expect(hero).toEqual(newHero);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/heroes`);
    expect(req.request.method).toBe('POST');

    req.flush(newHero);
  });

  it('should update a hero in the API via PUT', () => {
    const updatedHero: Hero = { id: '1', superhero: 'Updated Hero' };

    service.updateHero(updatedHero).subscribe(hero => {
      expect(hero).toEqual(updatedHero);
    });

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/heroes/${updatedHero.id}`
    );
    expect(req.request.method).toBe('PUT');

    req.flush(updatedHero);
  });

  it('should delete a hero from the API via DELETE', () => {
    const deletedHero: Hero = { id: '1', superhero: 'Deleted Hero' };

    service.deleteHero(deletedHero).subscribe(hero => {
      expect(hero).toEqual(deletedHero);
    });

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/heroes/${deletedHero.id}`
    );
    expect(req.request.method).toBe('DELETE');

    req.flush(deletedHero);
  });
  it('should set selected hero', () => {
    const dummyHero: Hero = { id: '1', superhero: 'Selected Hero' };

    service.setSelectedHero(dummyHero);

    service.selectedHeroWithGetById('1').subscribe(hero => {
      expect(hero).toEqual(dummyHero);
    });
  });
});
