import { Routes } from '@angular/router';

export const heroesRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/heroes-list/heroes-list.component').then(
        c => c.HeroesListComponent
      ),
  },
  {
    path: 'hero/:heroID',
    loadComponent: () =>
      import('./pages/hero/hero.component').then(c => c.HeroComponent),
  },
];
