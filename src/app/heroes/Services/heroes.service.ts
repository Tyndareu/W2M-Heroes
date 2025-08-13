import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Hero } from '../interfaces/hero.interface';

@Injectable({
  providedIn: 'root',
})
export class HeroesService {
  // The HttpClient for making HTTP requests.
  private readonly _http = inject(HttpClient);

  // The API URL for the heroes service.
  private readonly _apiUrl: string = environment.apiUrl;

  // The currently selected hero.
  private readonly _selectedHero = signal<Hero | null>(null);

  /**
   * Sets the selected hero.
   * @param hero The hero to set as selected.
   */
  public setSelectedHero(hero: Hero): void {
    this._selectedHero.set(hero);
  }

  /**
   * Gets a list of heroes, optionally filtered by a query.
   * @param query The query to filter heroes by.
   * @returns An Observable of an array of heroes.
   */
  public getHeroes(query: string | null): Observable<Hero[]> {
    return query !== null
      ? this._http.get<Hero[]>(`${this._apiUrl}/heroes?q=${query}&_limit=8`)
      : this._http.get<Hero[]>(`${this._apiUrl}/heroes`);
  }

  /**
   * Gets a hero by ID, using the selected hero if it matches.
   * @param heroID The ID of the hero to get.
   * @returns An Observable of the hero.
   */
  public selectedHeroWithGetById(heroID: string): Observable<Hero> {
    const selectedHero = this._selectedHero();

    return selectedHero?.id === heroID
      ? of(selectedHero)
      : this._getHeroById(heroID).pipe(tap(hero => this.setSelectedHero(hero)));
  }

  /**
   * Creates a new hero.
   * @param hero The hero to create.
   * @returns An Observable of the created hero.
   */
  public newHero(hero: Hero): Observable<Hero> {
    return this._http.post<Hero>(`${this._apiUrl}/heroes`, hero);
  }

  /**
   * Updates an existing hero.
   * @param hero The hero to update.
   * @returns An Observable of the updated hero.
   */
  public updateHero(hero: Hero): Observable<Hero> {
    return this._http.put<Hero>(`${this._apiUrl}/heroes/${hero.id}`, hero);
  }

  /**
   * Deletes a hero.
   * @param hero The hero to delete.
   * @returns An Observable of the deleted hero.
   */
  public deleteHero(hero: Hero): Observable<Hero> {
    return this._http.delete<Hero>(`${this._apiUrl}/heroes/${hero.id}`);
  }

  /**
   * Gets a hero by ID from the API.
   * @param heroID The ID of the hero to get.
   * @returns An Observable of the hero.
   */
  private _getHeroById(heroID: string): Observable<Hero> {
    return this._http
      .get<Hero>(`${environment.apiUrl}/heroes/${heroID}`)
      .pipe(tap(hero => this._selectedHero.set(hero)));
  }
}
