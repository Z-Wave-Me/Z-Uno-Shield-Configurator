import { Component, Input } from '@angular/core';
import { PinConfig } from '../../../../../services/store/pins-state.service';

@Component({
  selector: '[switch]',
  templateUrl: './switch.component.svg',
  styleUrls: ['./switch.component.scss'],
})
export class SwitchComponent {

  @Input()
  public pin?: PinConfig;
}
