import { Route } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { SelectorComponent } from './components/selector/selector.component';
import { RelationsComponent } from './components/relations/relations.component';
import { TestComponent } from './components/test/test.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
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
];
