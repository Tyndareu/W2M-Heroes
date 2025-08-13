import { Routes } from '@angular/router';
import { heroesRoutes } from './heroes/heroes.routes';

/** Defines the main application routes. */
export const routes: Routes = [
  { path: '', redirectTo: 'heroes', pathMatch: 'full' },
  ...heroesRoutes,
  {
    path: '404',
    loadComponent: () =>
      import('./shared/components/page-not-found/page-not-found.component').then(
        c => c.PageNotFoundComponent
      ),
  },
  {
    path: '**',
    redirectTo: '404',
  },
];
