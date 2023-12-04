import { Component, Input } from '@angular/core';
import { PinConfig } from '@configurator/shared';
import { ZUnoShieldPin } from '../../../../z-uno-shield.model';

@Component({
  selector: '[analog-input]',
  templateUrl: './analog-input.component.svg',
  styleUrls: ['./analog-input.component.scss'],
})
export class AnalogInputComponent {

  @Input()
  public pin?: PinConfig;
  protected readonly ZUnoShieldPin = ZUnoShieldPin;
}
