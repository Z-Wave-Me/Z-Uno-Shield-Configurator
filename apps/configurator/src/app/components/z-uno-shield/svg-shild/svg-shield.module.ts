import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgShieldComponent } from './svg-shield.component';
import { SandboxComponent } from './components/sandbox/sandbox.component';
import { ShieldComponent } from './components/shield/shield.component';
import { DimmerComponent } from './components/devices/dimmer/dimmer.component';
import { HostDirective } from './directives/host.directive';
import { HighlightPinDirective } from './directives/highlight-pin.directive';
import { DoorComponent } from './components/devices/door/door.component';
import { MotionSensorComponent } from './components/devices/motion-senser/motion-sensor.component';
import { SwitchComponent } from './components/devices/switch/switch.component';
import { DhtComponent } from './components/devices/dth22/dht.component';
import { Ds18b20Component } from './components/devices/ds18b20/ds18b20.component';
import { Dimmer010vComponent } from './components/devices/dimmer0-10v/dimmer010v.component';
import { RGBWComponent } from './components/devices/rgbw/rgbw.component';
import { BusBarComponent } from './components/busbars/busbar/bus-bar.component';
import { BusBarLayerComponent } from './components/busbars/bus-bar-layer.component';
import { AnalogInputComponent } from './components/devices/analog-input/analog-input.component';

@NgModule({
  declarations: [
    SvgShieldComponent,
    SandboxComponent,
    ShieldComponent,
    DimmerComponent,
    DoorComponent,
    MotionSensorComponent,
    SwitchComponent,
    DhtComponent,
    Ds18b20Component,
    Dimmer010vComponent,
    RGBWComponent,
    AnalogInputComponent,
    BusBarComponent,
    BusBarLayerComponent,
  ],
  exports: [SvgShieldComponent, SandboxComponent],
  imports: [CommonModule, HostDirective, HighlightPinDirective],
})
export class SvgShieldModule {}
