import { AfterViewInit, Component, Input } from '@angular/core';
import { PinSelectedService } from '../../../../../services/pin-selected/pin-selected.service';
import { PinConfig, PinsStateService } from '../../../../../services/store/pins-state.service';

@Component({
  selector: '[dimmer]',
  templateUrl: './dimmer.component.svg',
  styleUrls: ['./dimmer.component.scss'],
})
export class DimmerComponent {

  @Input()
  public pin?: PinConfig;
}
