import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgShieldComponent } from './svg-shield.component';
import { SandboxComponent } from './components/sandbox/sandbox.component';
import { ShieldComponent } from './components/shield/shield.component';



@NgModule({
  declarations: [
    SvgShieldComponent,
    SandboxComponent,
    ShieldComponent,
  ],
  exports: [
    SvgShieldComponent,
    SandboxComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SvgShieldModule { }
