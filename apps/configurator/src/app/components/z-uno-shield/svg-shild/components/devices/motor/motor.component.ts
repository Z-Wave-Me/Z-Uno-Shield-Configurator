import { Component, Input } from '@angular/core';
import { PinConfig } from '@configurator/shared';

@Component({
  selector: '[motor]',
  templateUrl: './motor.component.svg',
  styleUrls: ['./motor.component.scss'],
})
export class MotorComponent {

  @Input()
  public pin?: PinConfig;
}
