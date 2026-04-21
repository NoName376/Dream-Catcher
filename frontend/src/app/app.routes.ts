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
    path: '',
    loadComponent: () => import('./components/layout/app-layout/app-layout').then((m) => m.AppLayout),
    canActivate: [authGuard],
    children: [
      {
        path: 'feed',
        loadComponent: () => import('./components/feed/feed').then((m) => m.Feed)
      },
      {
        path: 'bookmarks',
        loadComponent: () => import('./components/bookmarks/bookmarks').then((m) => m.Bookmarks)
      },
      {
        path: 'profile',
        loadComponent: () => import('./components/user-profile/user-profile').then((m) => m.UserProfile)
      },
      {
        path: 'settings',
        loadComponent: () => import('./components/settings/settings/settings').then((m) => m.Settings)
      },
      {
        path: 'analysis',
        loadComponent: () => import('./components/analysis/analysis').then((m) => m.AnalysisComponent)
      },
      {
        path: '',
        redirectTo: 'feed',
        pathMatch: 'full'
      }
    ]
  }
];
