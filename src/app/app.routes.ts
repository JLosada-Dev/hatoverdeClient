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
        path: 'bovine/:id',
        loadComponent: () =>
          import(
            './domains/bovine/pages/bovine-detail/bovine-detail.component'
          ),
      },
    ],
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
