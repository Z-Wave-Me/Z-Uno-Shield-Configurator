import { Route } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';

export const appRoutes: Route[] = [
  {
    path: 'shield',
    component: LayoutComponent,
    loadChildren: () => import('./components/z-uno-shield/z-uno-shield.module').then(m => m.ZUnoShieldModule),
  },
  // {
  //   path: 'zgm230s',
  //   component: LayoutComponent,
  //   loadChildren: () => import('./components/chip/chip.module').then(m => m.ChipModule),
  // },
  // {
  //   path: 'zm8202',
  //   component: LayoutComponent,
  //   loadChildren: () => import('./components/zm8202/zm8202.module').then(m => m.Zm8202Module),
  // },
  {
    path: '**',
    redirectTo: 'shield',
  },
];
