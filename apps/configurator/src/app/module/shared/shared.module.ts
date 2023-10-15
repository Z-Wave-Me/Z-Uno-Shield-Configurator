import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PinConfiguratorComponent } from './pin-configurator/pin-configurator.component';
import { ChildDeviceConfiguratorComponent } from './child-pin-configurator/child-device-configurator.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [PinConfiguratorComponent, ChildDeviceConfiguratorComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatButtonModule,
  ],
  exports: [PinConfiguratorComponent, ChildDeviceConfiguratorComponent],
})
export class SharedModule {}
