import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Zm8202RoutingModule } from './zm8202-routing.module';
import { Zm8202WrapperComponent } from './zm8202-wrapper/zm8202-wrapper.component';
import { MatTabsModule } from '@angular/material/tabs';
import { SelectorComponent } from './selector/selector.component';
import { SvgZm8202Component } from './svg-chip/svg-zm8202.component';
import { Zm8202Component } from './components/zm8202/zm8202.component';
import { SelectableDirective } from '../../directives/selectable/selectable.directive';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from '../../module/shared/shared.module';

@NgModule({
  declarations: [
    Zm8202WrapperComponent,
    SelectorComponent,
    SvgZm8202Component,
    Zm8202Component,
  ],
  imports: [
    CommonModule,
    Zm8202RoutingModule,
    MatTabsModule,
    SelectableDirective,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatIconModule,
    SharedModule,
  ],
  exports: [],
})
export class Zm8202Module {}
