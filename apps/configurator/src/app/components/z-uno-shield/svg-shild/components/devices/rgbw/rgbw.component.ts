import { Component, Input } from '@angular/core';

import { PinConfig } from '../../../../../../../../../../libs/shared/src/lib/models/pin.config';
import { ColorDevices } from '@configurator/arduino-code-gen';

@Component({
  selector: '[rgbw]',
  templateUrl: './rgbw.component.svg',
  styleUrls: ['./rgbw.component.scss'],
})
export class RGBWComponent {

  @Input()
  public pin?: PinConfig;
}
