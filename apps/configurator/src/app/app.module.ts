import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutComponent } from './components/layout/layout.component';
import { ChildDeviceConfiguratorComponent } from './components/shield-pages/child-pin-configurator/child-device-configurator.component';
import { TestComponent } from './components/test/test.component';
import { MatIconModule } from '@angular/material/icon';
import { SvgShieldModule } from './components/shield-pages/svg-shild/svg-shield.module';
import { SelectableDirective } from './directives/selectable/selectable.directive';
import { MatTabsModule } from '@angular/material/tabs';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {
  MAT_TOOLTIP_DEFAULT_OPTIONS,
  MatTooltipDefaultOptions,
} from '@angular/material/tooltip';
import { HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { MatButtonModule } from '@angular/material/button';
import { PinConfiguratorComponent } from './components/shield-pages/pin-configurator/pin-configurator.component';
import { SelectorComponent } from './components/shield-pages/selector/selector.component';
import { RelationsComponent } from './components/shield-pages/relations/relations.component';
import { ShieldWrapperComponent } from './components/shield-pages/shield-wrapper/shield-wrapper.component';

const customTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 1000,
  touchendHideDelay: 1000,
};

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    ChildDeviceConfiguratorComponent,
    PinConfiguratorComponent,
    SelectorComponent,
    TestComponent,
    RelationsComponent,
    ShieldWrapperComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, {
      initialNavigation: 'enabledBlocking',
      useHash: true,
    }),
    BrowserAnimationsModule,
    MatSnackBarModule,

    MatIconModule,
    SvgShieldModule,
    SelectableDirective,
    MatTabsModule,
    FooterComponent,
    HeaderComponent,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  providers: [
    {
      provide: MAT_TOOLTIP_DEFAULT_OPTIONS,
      useValue: customTooltipDefaults,
    },
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        coreLibraryLoader: () => import('highlight.js/lib/core'),
        languages: {
          arduino: () => import('highlight.js/lib/languages/arduino'),
        },
      },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
