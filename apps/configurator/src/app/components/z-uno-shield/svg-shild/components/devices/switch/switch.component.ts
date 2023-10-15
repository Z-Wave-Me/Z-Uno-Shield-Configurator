import { Component, Input } from '@angular/core';

import { PinConfig } from '../../../../../../../../../../libs/shared/src/lib/models/pin.config';

@Component({
  selector: '[switch]',
  templateUrl: './switch.component.svg',
  styleUrls: ['./switch.component.scss'],
})
export class SwitchComponent {

  @Input()
  public pin?: PinConfig;
}
