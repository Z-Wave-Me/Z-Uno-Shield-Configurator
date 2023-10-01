import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Zm8202RoutingModule } from './zm8202-routing.module';
import { ChipWrapperComponent } from './chip-wrapper/chip-wrapper.component';
import { MatTabsModule } from '@angular/material/tabs';
import { SelectorComponent } from './selector/selector.component';
import { SvgChipComponent } from './svg-chip/svg-chip.component';
import { ChipComponent } from './components/chip/chip.component';
import { SelectableDirective } from '../../directives/selectable/selectable.directive';
import { PinConfiguratorComponent } from './pin-configurator/pin-configurator.component';
import { ChildDeviceConfiguratorComponent } from './child-pin-configurator/child-device-configurator.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    ChipWrapperComponent,
    SelectorComponent,
    SvgChipComponent,
    ChipComponent,
    PinConfiguratorComponent,
    ChildDeviceConfiguratorComponent,
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
  ],
})
export class Zm8202Module {}
