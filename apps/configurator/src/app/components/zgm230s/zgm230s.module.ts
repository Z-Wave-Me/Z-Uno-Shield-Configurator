import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ZGM230SRoutingModule } from './zgm230s-routing.module';
import { Zgm230sWrapperComponent } from './zgm230s-wrapper/zgm230s-wrapper.component';
import { MatTabsModule } from '@angular/material/tabs';
import { SelectorComponent } from './selector/selector.component';
import { SvgZgm230sComponent } from './svg-chip/svg-zgm230s.component';
import { Zgm230sComponent } from './components/zgm230s/zgm230s.component';
import { SelectableDirective } from '../../directives/selectable/selectable.directive';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from '../../module/shared/shared.module';

@NgModule({
  declarations: [
    Zgm230sWrapperComponent,
    SelectorComponent,
    SvgZgm230sComponent,
    Zgm230sComponent,
  ],
  imports: [
    CommonModule,
    ZGM230SRoutingModule,
    MatTabsModule,
    SelectableDirective,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatIconModule,
    SharedModule,
  ],
})
export class ZGM230SModule {}
