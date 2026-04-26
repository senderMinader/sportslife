import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { LoginPageComponent } from './features/auth/pages/login-page.component';
import { TournamentsListPageComponent } from './features/tournaments/pages/tournaments-list-page.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent,
  },
  {
    path: 'tournaments',
    canActivate: [authGuard],
    component: TournamentsListPageComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'tournaments',
  },
  {
    path: '**',
    redirectTo: 'tournaments',
  },
];
