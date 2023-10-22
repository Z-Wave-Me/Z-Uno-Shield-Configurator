import { Route } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';

export const appRoutes: Route[] = [
  {
    path: 'shield',
    component: LayoutComponent,
    loadChildren: () => import('./components/z-uno-shield/z-uno-shield.module').then(m => m.ZUnoShieldModule),
    data: {
      title: $localize`Z-Uno Shield`,
    },
  },
  {
    path: 'zgm230s',
    component: LayoutComponent,
    loadChildren: () => import('./components/zgm230s/zgm230s.module').then(m => m.ZGM230SModule),
    data: {
      title: $localize`ZGM230S`,
    },
  },
  {
    path: 'zm8202',
    component: LayoutComponent,
    loadChildren: () => import('./components/zm8202/zm8202.module').then(m => m.Zm8202Module),
    data: {
      title: $localize`ZM8202`,
    },
  },
  {
    path: '**',
    redirectTo: 'shield',
  },
];
