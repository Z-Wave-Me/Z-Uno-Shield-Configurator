import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ZUnoShieldRoutingModule } from './z-uno-shield-routing.module';
import { ShieldWrapperComponent } from './shield-wrapper/shield-wrapper.component';
import { AssociationsComponent } from './associations/associations.component';
import { SelectorComponent } from './selector/selector.component';
import { SvgShieldModule } from './svg-shild/svg-shield.module';
import { MatTabsModule } from '@angular/material/tabs';
import { SharedModule } from '../../module/shared/shared.module';
import { SelectableDirective } from '../../directives/selectable/selectable.directive';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { RulesComponent } from './rules/rules.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { InstructionsComponent } from './instructions/instructions.component';


@NgModule({
  declarations: [
    SelectorComponent,
    AssociationsComponent,
    ShieldWrapperComponent,
    RulesComponent,
    InstructionsComponent,
  ],
  imports: [
    CommonModule,
    ZUnoShieldRoutingModule,
    SvgShieldModule,
    MatTabsModule,
    SharedModule,
    SelectableDirective,
    MatButtonModule,
    MatSelectModule,
    MatMenuModule,
    MatIconModule,
    MatListModule,
  ],
})
export class ZUnoShieldModule {}
