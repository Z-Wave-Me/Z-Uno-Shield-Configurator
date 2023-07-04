import { AfterViewInit, Component, Input } from '@angular/core';
import { PinSelectedService } from '../../../../../services/pin-selected/pin-selected.service';
import { PinConfig, PinsStateService } from '../../../../../services/store/pins-state.service';

@Component({
  selector: '[dimmer]',
  templateUrl: './dimmer.component.svg',
  styleUrls: ['./dimmer.component.scss'],
})
export class DimmerComponent implements AfterViewInit {

  @Input()
  public pin?: PinConfig;

  constructor() {

  }

  public doSomething(): void {
    console.log('do it');
    // this.pinSelectedService.select({ id: 'PWM3' });
  }

  public ngAfterViewInit(): void {

  }
}
