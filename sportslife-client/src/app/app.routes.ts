import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { LoginPageComponent } from './features/auth/pages/login-page.component';
import { TournamentsListPageComponent } from './features/tournaments/pages/tournaments-list-page.component';
import { TournamentCreatePageComponent } from './features/tournaments/pages/tournament-create-page.component';
import { TournamentDetailPageComponent } from './features/tournaments/pages/tournament-detail-page.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'tournaments',
  },
  {
    path: 'login',
    component: LoginPageComponent,
  },
  {
    path: 'tournaments',
    children: [
      {
        path: '',
        component: TournamentsListPageComponent,
      },
      {
        path: ':id',
        component: TournamentDetailPageComponent,
      },
      {
        path: 'create',
        canActivate: [authGuard],
        component: TournamentCreatePageComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'tournaments',
  },
];
