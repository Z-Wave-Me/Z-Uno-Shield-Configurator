import { Route } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { TestComponent } from './components/test/test.component';
import { ShieldWrapperComponent } from './components/shield-pages/shield-wrapper/shield-wrapper.component';
import { SelectorComponent } from './components/shield-pages/selector/selector.component';
import { RelationsComponent } from './components/shield-pages/relations/relations.component';
import { ChipWrapperComponent } from './components/chip/chip-wrapper/chip-wrapper.component';

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
    path: 'chip',
    component: LayoutComponent,
    loadChildren: () => import('./components/chip/chip.module').then(m => m.ChipModule),
  },
  {
    path: '**',
    redirectTo: 'shield',
  },
];
