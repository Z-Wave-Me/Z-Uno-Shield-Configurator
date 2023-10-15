import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ZUnoShieldRoutingModule } from './z-uno-shield-routing.module';
import { ShieldWrapperComponent } from './shield-wrapper/shield-wrapper.component';
import { RelationsComponent } from './relations/relations.component';
import { SelectorComponent } from './selector/selector.component';
import { SvgShieldModule } from './svg-shild/svg-shield.module';
import { MatTabsModule } from '@angular/material/tabs';
import { SharedModule } from '../../module/shared/shared.module';
import { SelectableDirective } from '../../directives/selectable/selectable.directive';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [SelectorComponent, RelationsComponent, ShieldWrapperComponent],
  imports: [
    CommonModule,
    ZUnoShieldRoutingModule,
    SvgShieldModule,
    MatTabsModule,
    SharedModule,
    SelectableDirective,
    MatButtonModule,
  ],
})
export class ZUnoShieldModule {}
