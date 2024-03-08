import { Routes } from '@angular/router';

export const heroesRoutes: Routes = [
  {
    path: 'heroes',
    loadComponent: () =>
      import('./pages/layout-page/layout-page.component').then(
        c => c.LayoutPageComponent
      ),
    children: [
      {
        path: '',
        redirectTo: 'heroes-list',
        pathMatch: 'full',
      },
      {
        path: 'heroes-list',
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
    ],
  },
];
