import { Component } from '@angular/core';
import {PinSelectedService} from "../../../../services/pin-selected/pin-selected.service";

@Component({
  selector: '[sandbox]',
  templateUrl: './sandbox.component.svg',
  styleUrls: ['./sandbox.component.scss']
})
export class SandboxComponent {

  constructor(private readonly pinSelectedService: PinSelectedService) {
  }
  doSomething() {
    console.log('do it');
    this.pinSelectedService.select('PWM3');
  }
}
