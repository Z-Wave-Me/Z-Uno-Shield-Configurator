import { Component, Input } from '@angular/core';

import { PinConfig } from '@configurator/shared';

@Component({
  selector: '[general]',
  templateUrl: './general.component.svg',
  styleUrls: ['./general.component.scss'],
})
export class GeneralComponent {

  @Input()
  public pin?: PinConfig;
}
