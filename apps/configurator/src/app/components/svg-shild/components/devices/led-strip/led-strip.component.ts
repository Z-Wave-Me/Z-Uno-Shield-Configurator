import { Component } from '@angular/core';
import { PinSelectedService } from '../../../../../services/pin-selected/pin-selected.service';

@Component({
  selector: '[led-strip]',
  templateUrl: './led-strip.component.svg',
  styleUrls: ['./led-strip.component.scss'],
})
export class LedStripComponent {

  constructor(
    private readonly pinSelectedService: PinSelectedService,
  ) {}

  public doSomething(): void {
    console.log('do it');
    // this.pinSelectedService.select({ id: 'PWM3' });
  }
}
