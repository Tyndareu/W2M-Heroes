import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Hero } from '../interfaces/hero.interface';

@Injectable({
  providedIn: 'root',
})
export class HeroesService {
  private readonly _http = inject(HttpClient);

  private readonly _apiUrl: string = environment.apiUrl;

  private readonly _selectedHero = signal<Hero | null>(null);

  public setSelectedHero(hero: Hero): void {
    this._selectedHero.set(hero);
  }

  public getHeroes(query: string | null): Observable<Hero[]> {
    return query !== null
      ? this._http.get<Hero[]>(`${this._apiUrl}/heroes?q=${query}&_limit=8`)
      : this._http.get<Hero[]>(`${this._apiUrl}/heroes`);
  }

  public selectedHeroWithGetById(heroID: string): Observable<Hero> {
    const selectedHero = this._selectedHero();

    return selectedHero?.id === heroID
      ? of(selectedHero)
      : this._getHeroById(heroID).pipe(tap(hero => this.setSelectedHero(hero)));
  }

  public newHero(hero: Hero): Observable<Hero> {
    return this._http.post<Hero>(`${this._apiUrl}/heroes`, hero);
  }

  public updateHero(hero: Hero): Observable<Hero> {
    return this._http.put<Hero>(`${this._apiUrl}/heroes/${hero.id}`, hero);
  }

  public deleteHero(hero: Hero): Observable<Hero> {
    return this._http.delete<Hero>(`${this._apiUrl}/heroes/${hero.id}`);
  }

  private _getHeroById(heroID: string): Observable<Hero> {
    return this._http
      .get<Hero>(`${environment.apiUrl}/heroes/${heroID}`)
      .pipe(tap(hero => this._selectedHero.set(hero)));
  }
}
