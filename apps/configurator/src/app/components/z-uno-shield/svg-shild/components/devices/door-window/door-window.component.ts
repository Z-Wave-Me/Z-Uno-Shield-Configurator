import { Component, Input } from '@angular/core';

import { PinConfig } from '@configurator/shared';

@Component({
  selector: '[door-window]',
  templateUrl: './door-window.component.svg',
  styleUrls: ['./door-window.component.scss'],
})
export class DoorWindowComponent {

  @Input()
  public pin?: PinConfig;
}
