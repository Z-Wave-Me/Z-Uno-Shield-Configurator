import { Component, Input } from '@angular/core';

import { PinConfig } from '../../../../../../../../../../libs/shared/src/lib/models/pin.config';

@Component({
  selector: '[dimmer0-10v]',
  templateUrl: './dimmer0-10v.component.svg',
  styleUrls: ['./dimmer0-10v.component.scss'],
})
export class Dimmer010vComponent {

  @Input()
  public pin?: PinConfig;
}
