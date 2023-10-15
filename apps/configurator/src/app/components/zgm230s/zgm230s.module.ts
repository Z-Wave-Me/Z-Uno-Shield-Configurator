import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ZGM230SRoutingModule } from './zgm230s-routing.module';
import { ChipWrapperComponent } from './chip-wrapper/chip-wrapper.component';
import { MatTabsModule } from '@angular/material/tabs';
import { SelectorComponent } from './selector/selector.component';
import { SvgChipComponent } from './svg-chip/svg-chip.component';
import { ChipComponent } from './components/chip/chip.component';
import { SelectableDirective } from '../../directives/selectable/selectable.directive';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from '../../module/shared/shared.module';

@NgModule({
  declarations: [
    ChipWrapperComponent,
    SelectorComponent,
    SvgChipComponent,
    ChipComponent,
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
