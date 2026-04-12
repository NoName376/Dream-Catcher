import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login/login').then((m) => m.Login)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/auth/register/register').then((m) => m.Register)
  },
  {
    path: 'feed',
    canActivate: [authGuard],
    loadComponent: () => import('./components/feed/feed').then((m) => m.Feed)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./components/user-profile/user-profile').then((m) => m.UserProfile)
  },
  {
    path: '',
    redirectTo: 'feed',
    pathMatch: 'full'
  }
];
