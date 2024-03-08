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
          import('./pages/hero-page/hero.component').then(c => c.HeroComponent),
      },
      {
        path: 'search-hero',
        loadComponent: () =>
          import('./pages/search-page/search-page.component').then(
            c => c.SearchPageComponent
          ),
      },
    ],
  },
];
