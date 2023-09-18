import { Component, Input } from '@angular/core';
import { PinConfig } from '../../../../../../services/store/pins-state.service';

@Component({
  selector: '[dimmer0-10v]',
  templateUrl: './dimmer0-10v.component.svg',
  styleUrls: ['./dimmer0-10v.component.scss'],
})
export class Dimmer010vComponent {

  @Input()
  public pin?: PinConfig;
}
