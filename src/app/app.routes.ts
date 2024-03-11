import { Routes } from '@angular/router';
import { heroesRoutes } from './heroes/heroes.routes';

export const routes: Routes = [
  { path: '', redirectTo: 'heroes', pathMatch: 'full' },
  ...heroesRoutes,
  {
    path: '404',
    loadComponent: () =>
      import('./core/components/page-not-found/page-not-found.component').then(
        c => c.PageNotFoundComponent
      ),
  },
  {
    path: '**',
    redirectTo: '404',
  },
];
