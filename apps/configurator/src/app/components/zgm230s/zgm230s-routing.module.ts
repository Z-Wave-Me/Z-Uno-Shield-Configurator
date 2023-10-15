import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChipWrapperComponent } from './chip-wrapper/chip-wrapper.component';
import { SelectorComponent } from './selector/selector.component';

const routes: Routes = [
  {
    path: '',
    component: ChipWrapperComponent,
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
