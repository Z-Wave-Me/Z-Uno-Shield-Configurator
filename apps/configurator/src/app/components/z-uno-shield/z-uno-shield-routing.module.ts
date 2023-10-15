import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShieldWrapperComponent } from './shield-wrapper/shield-wrapper.component';
import { SelectorComponent } from './selector/selector.component';
import { RelationsComponent } from './relations/relations.component';

const routes: Routes = [
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
        path: '**',
        redirectTo: '',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ZUnoShieldRoutingModule { }
