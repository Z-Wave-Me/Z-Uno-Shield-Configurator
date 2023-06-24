import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { CopyToClipboardDirective } from '../../directives/copy-to-clipboard/copy-to-clipboard.directive';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HIGHLIGHT_OPTIONS, HighlightModule } from 'ngx-highlightjs';
import { SaveAsFileDirective } from '../../directives/save-as-file/save-as-file.directive';



@Component({
  selector: 'configurator-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatExpansionModule,
    MatButtonModule,
    ClipboardModule,
    CopyToClipboardDirective,
    MatTooltipModule,
    HighlightModule,
    SaveAsFileDirective,
  ],
})
export class FooterComponent {
  public panelOpenState = false;
  public code = `
  // Global variables
byte pin3SensorMultilevelState;
byte pin4SensorMultilevelState;

// Z-Wave channels
ZUNO_SETUP_CHANNELS(
  ZUNO_SENSOR_MULTILEVEL(ZUNO_SENSOR_MULTILEVEL_TYPE_GENERAL_PURPOSE_VALUE, SENSOR_MULTILEVEL_SCALE_PERCENTAGE_VALUE, SENSOR_MULTILEVEL_SIZE_ONE_BYTE, SENSOR_MULTILEVEL_PRECISION_ZERO_DECIMALS, pin3SensorMultilevelGetter),
  ZUNO_SENSOR_MULTILEVEL(ZUNO_SENSOR_MULTILEVEL_TYPE_GENERAL_PURPOSE_VALUE, SENSOR_MULTILEVEL_SCALE_PERCENTAGE_VALUE, SENSOR_MULTILEVEL_SIZE_ONE_BYTE, SENSOR_MULTILEVEL_PRECISION_ZERO_DECIMALS, pin4SensorMultilevelGetter)
);

void setup() {
  pinMode(3, INPUT);
  pinMode(4, INPUT);
}

void loop() {
  pin3SensorMultilevelState = (byte) (50 * analogRead(3) / 431) + 0; // Math in integer numbers
  zunoSendReport(1); // report every 30 seconds

  pin4SensorMultilevelState = (byte) (50 * analogRead(4) / 431) + 0; // Math in integer numbers
  zunoSendReport(2); // report every 30 seconds
  delay(20);
}

// Getters and setters
byte pin3SensorMultilevelGetter() {
  return pin3SensorMultilevelState;
}

byte pin4SensorMultilevelGetter() {
  return pin4SensorMultilevelState;
}`;

  public prevent(event: Event): void {
    event.stopPropagation();
  }
}
