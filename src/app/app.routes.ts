import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'heroes', pathMatch: 'full' },
  {
    path: 'heroes',
    loadChildren: () =>
      import('./heroes/heroes.routes').then(r => r.heroesRoutes),
  },

  {
    path: '404',
    loadComponent: () =>
      import('./shared/page-not-found/page-not-found.component').then(
        c => c.PageNotFoundComponent
      ),
  },
  {
    path: '**',
    redirectTo: '404',
  },
];
