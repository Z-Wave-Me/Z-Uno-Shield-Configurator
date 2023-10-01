import { Route } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { TestComponent } from './components/test/test.component';
import { ShieldWrapperComponent } from './components/shield-pages/shield-wrapper/shield-wrapper.component';
import { SelectorComponent } from './components/shield-pages/selector/selector.component';
import { RelationsComponent } from './components/shield-pages/relations/relations.component';

export const appRoutes: Route[] = [
  {
    path: 'shield',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: ShieldWrapperComponent,
        children: [
          {
            path: '',
            component: SelectorComponent,
          },
          {
            path: 'relations',
            component: RelationsComponent,
          },
          {
            path: 'test',
            component: TestComponent,
          },
          {
            path: '**',
            redirectTo: '',
          },
        ],
      },
    ],
  },
  {
    path: 'zgm230s',
    component: LayoutComponent,
    loadChildren: () => import('./components/chip/chip.module').then(m => m.ChipModule),
  },
  {
    path: 'zm8202',
    component: LayoutComponent,
    loadChildren: () => import('./components/zm8202/zm8202.module').then(m => m.Zm8202Module),
  },
  {
    path: '**',
    redirectTo: 'shield',
  },
];
