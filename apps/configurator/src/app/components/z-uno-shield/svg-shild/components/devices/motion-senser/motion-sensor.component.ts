import { AfterViewInit, Component, Input } from '@angular/core';

import { PinConfig } from '../../../../../../../../../../libs/shared/src/lib/models/pin.config';

@Component({
  selector: '[motion-sensor]',
  templateUrl: './motion-sensor.component.svg',
  styleUrls: ['./motion-sensor.component.scss'],
})
export class MotionSensorComponent {

  @Input()
  public pin?: PinConfig;
}
