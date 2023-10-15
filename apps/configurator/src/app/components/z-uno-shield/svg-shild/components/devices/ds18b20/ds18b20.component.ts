import { AfterViewInit, Component, Input } from '@angular/core';

import { PinConfig } from '../../../../../../../../../../libs/shared/src/lib/models/pin.config';

@Component({
  selector: '[ds18b20]',
  templateUrl: './ds18b20.component.svg',
  styleUrls: ['./ds18b20.component.scss'],
})
export class Ds18b20Component {

  @Input()
  public pin?: PinConfig;
}