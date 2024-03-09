import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Hero } from '../interfaces/hero.interface';

@Injectable({
  providedIn: 'root',
})
export class HeroesService {
  private readonly apiUrl = environment.apiUrl;
  private selectedHero = new BehaviorSubject<Hero | null>(null);

  constructor(private http: HttpClient) {}

  public setSelectedHero(hero: Hero): void {
    this.selectedHero.next(hero);
  }

  public getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${this.apiUrl}/heroes`);
  }

  public getSearchHeroes(query: string): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${this.apiUrl}/heroes?q=${query}&_limit=3`);
  }

  public selectedHeroWithGetById(heroID: string): Observable<Hero> {
    return this.selectedHero.pipe(
      switchMap(hero => {
        if (hero && hero.id === heroID) {
          return of(hero);
        } else {
          return this.getHeroById(heroID).pipe(
            tap(hero => this.setSelectedHero(hero))
          );
        }
      })
    );
  }

  public newHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(`${this.apiUrl}/heroes`, hero);
  }

  public updateHero(hero: Hero): Observable<Hero> {
    return this.http.put<Hero>(`${this.apiUrl}/heroes/${hero.id}`, hero);
  }

  public deleteHero(hero: Hero): Observable<Hero> {
    return this.http.delete<Hero>(`${this.apiUrl}/heroes/${hero.id}`);
  }

  private getHeroById(heroID: string): Observable<Hero> {
    return this.http
      .get<Hero>(`${environment.apiUrl}/heroes/${heroID}`)
      .pipe(tap(hero => this.selectedHero.next(hero)));
  }
}
