import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PinConfiguratorComponent } from './pin-configurator/pin-configurator.component';
import { ChildDeviceConfiguratorComponent } from './child-pin-configurator/child-device-configurator.component';



@NgModule({
  declarations: [PinConfiguratorComponent, ChildDeviceConfiguratorComponent],
  imports: [
    CommonModule,
  ],
  exports: [PinConfiguratorComponent, ChildDeviceConfiguratorComponent],
})
export class SharedModule { }
