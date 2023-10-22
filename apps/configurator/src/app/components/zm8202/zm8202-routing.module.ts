import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Zm8202WrapperComponent } from './zm8202-wrapper/zm8202-wrapper.component';
import { SelectorComponent } from './selector/selector.component';

const routes: Routes = [
  {
    path: '',
    component: Zm8202WrapperComponent,
    children: [{
      path: '',
      component: SelectorComponent,
    }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Zm8202RoutingModule { }
