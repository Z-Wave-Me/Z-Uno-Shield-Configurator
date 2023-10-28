import { Component, Input } from '@angular/core';

import { PinConfig } from '@configurator/shared';

@Component({
  selector: '[switch]',
  templateUrl: './switch.component.svg',
  styleUrls: ['./switch.component.scss'],
})
export class SwitchComponent {

  @Input()
  public pin?: PinConfig;
}
