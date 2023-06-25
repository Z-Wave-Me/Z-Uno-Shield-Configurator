import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgShieldComponent } from './svg-shield.component';
import { SandboxComponent } from './components/sandbox/sandbox.component';
import { ShieldComponent } from './components/shield/shield.component';
import { LedStripComponent } from './components/devices/led-strip/led-strip.component';
import { HostDirective } from './directives/host.directive';
import { HighlightPinDirective } from './directives/highlight-pin.directive';

@NgModule({
  declarations: [
    SvgShieldComponent,
    SandboxComponent,
    ShieldComponent,
    LedStripComponent,
  ],
  exports: [SvgShieldComponent, SandboxComponent],
  imports: [CommonModule, HostDirective, HighlightPinDirective],
})
export class SvgShieldModule {}
