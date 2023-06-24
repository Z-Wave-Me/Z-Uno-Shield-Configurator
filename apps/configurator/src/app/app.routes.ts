import { Route } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { SelectorComponent } from './components/selector/selector.component';
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
        path: 'test',
        component: TestComponent,
      },
    ],
  },
];
