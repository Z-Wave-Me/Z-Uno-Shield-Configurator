import { Component, Input } from '@angular/core';
import {
  PinConfig,
} from '../../../../../services/store/pins-state.service';

@Component({
  selector: '[rgbw]',
  templateUrl: './rgbw.component.svg',
  styleUrls: ['./rgbw.component.scss'],
})
export class RGBWComponent {
  @Input()
  public pin?: PinConfig;
}
