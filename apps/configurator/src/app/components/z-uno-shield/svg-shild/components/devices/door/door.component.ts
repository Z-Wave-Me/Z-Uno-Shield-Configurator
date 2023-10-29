import { Component, Input } from '@angular/core';

import { PinConfig } from '@configurator/shared';

@Component({
  selector: '[door]',
  templateUrl: './door.component.svg',
  styleUrls: ['./door.component.scss'],
})
export class DoorComponent {

  @Input()
  public pin?: PinConfig;
}
