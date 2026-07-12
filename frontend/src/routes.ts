import { lazy } from 'solid-js';
import type { RouteDefinition } from '@solidjs/router';

import Home from './pages/home';
import AboutData from './pages/about.data';

export const routes: RouteDefinition[] = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/login',
    component: lazy(() => import('./modules/login')),
  },
  {
    path: '/register',
    component: lazy(() => import('./modules/register')),
  },
  {
    path: '/trackers',
    component: lazy(() => import('./modules/trackers')),
  },
  {
    path: '/about',
    component: lazy(() => import('./pages/about')),
    preload: AboutData,
  },
  {
    path: '**',
    component: lazy(() => import('./errors/404')),
  },
];
