import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgShieldComponent } from './svg-shield.component';
import { SandboxComponent } from './components/sandbox/sandbox.component';
import { ShieldComponent } from './components/shield/shield.component';
import { DimmerComponent } from './components/devices/dimmer/dimmer.component';
import { HostDirective } from './directives/host.directive';
import { HighlightPinDirective } from './directives/highlight-pin.directive';
import { DoorWindowComponent } from './components/devices/door-window/door-window.component';

@NgModule({
  declarations: [
    SvgShieldComponent,
    SandboxComponent,
    ShieldComponent,
    DimmerComponent,
    DoorWindowComponent,
  ],
  exports: [SvgShieldComponent, SandboxComponent],
  imports: [CommonModule, HostDirective, HighlightPinDirective],
})
export class SvgShieldModule {}
