import { Component, Input } from '@angular/core';
import { PinConfig } from '@configurator/shared';

@Component({
  selector: '[dimmer]',
  templateUrl: './dimmer.component.svg',
  styleUrls: ['./dimmer.component.scss'],
})
export class DimmerComponent {

  @Input()
  public pin?: PinConfig;
}
