import { Routes } from '@angular/router';

import { ErrorComponent } from './error.component';

export const errorRoute: Routes = [
  {
    path: 'error',
    component: ErrorComponent,
    data: {
      pageTitle: 'Strona błędu!',
    },
  },
  {
    path: 'accessdenied',
    component: ErrorComponent,
    data: {
      pageTitle: 'Strona błędu!',
      errorMessage: 'Nie masz praw dostępu do tej strony.',
    },
  },
  {
    path: '404',
    component: ErrorComponent,
    data: {
      pageTitle: 'Strona błędu!',
      errorMessage: 'Strona nie istnieje.',
    },
  },
  {
    path: '**',
    redirectTo: '/404',
  },
];
