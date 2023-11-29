import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShieldWrapperComponent } from './shield-wrapper/shield-wrapper.component';
import { SelectorComponent } from './selector/selector.component';
import { AssociationsComponent } from './associations/associations.component';
import { RulesComponent } from './rules/rules.component';
import { InstructionsComponent } from './instructions/instructions.component';

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
        path: 'associations',
        component: AssociationsComponent,
      },
      {
        path: 'rules',
        component: RulesComponent,
      },
      {
        path: 'instructions',
        component: InstructionsComponent,
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
