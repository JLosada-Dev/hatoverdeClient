import { Routes } from '@angular/router';
import { LayoutComponent } from './domains/shared/components/layout/layout.component';
import { NotFoundComponent } from './domains/info/pages/not-found/not-found.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./domains/bovine/pages/list-bovine/list-bovine.component'),
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./domains/info/pages/about/about.component').then(
            (m) => m.AboutComponent,
          ),
      },
      {
        path: 'bovine/:id',
        loadComponent: () =>
          import(
            './domains/bovine/pages/bovine-detail/bovine-detail.component'
          ),
      },
      {
        path: 'bovines/add',
        loadComponent: () =>
          import('./domains/bovine/pages/add-bovine/add-bovine.component'),
      },
      {
        path: 'production',
        loadComponent: () =>
          import(
            './domains/production/pages/production-esp32/production-esp32.component'
          ),
      },
    ],
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
