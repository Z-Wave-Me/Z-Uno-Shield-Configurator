import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Zgm230sWrapperComponent } from './zgm230s-wrapper/zgm230s-wrapper.component';
import { SelectorComponent } from './selector/selector.component';

const routes: Routes = [
  {
    path: '',
    component: Zgm230sWrapperComponent,
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
export class ZGM230SRoutingModule { }
