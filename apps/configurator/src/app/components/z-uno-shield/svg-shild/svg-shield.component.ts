import { Component, ViewEncapsulation } from '@angular/core';
import { PinSelectedService } from '../../../services/pin-selected/pin-selected.service';
import { config, filter, map, Observable, switchMap } from 'rxjs';
import {
  PinsStateService,
} from '../../../services/store/pins-state.service';
import { PinConfig } from '../../../../../../../libs/shared/src/lib/models/pin.config';
import { ColorDevices, SensorMultilevelDevices } from '@configurator/arduino-code-gen';

@Component({
  selector: 'configurator-svg-shield',
  templateUrl: './svg-shield.component.svg',
  styleUrls: ['./svg-shield.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class SvgShieldComponent {
  protected selectedPin$: Observable<PinConfig | undefined>;
  protected colorDevices = Object.values(ColorDevices);

  constructor(
    private readonly pinSelectedService: PinSelectedService,
    private readonly pinsStateService: PinsStateService,
  ) {
    this.selectedPin$ = this.pinSelectedService.selectObserver.pipe(
      switchMap((pinId) =>
        this.pinsStateService.state$.pipe(
          map((items) => {
            return items.find((item) => item.id === pinId);
          }),
          filter(Boolean),
        ),
      ),
    );
  }

  public isColorDevice(deviceId: undefined | string | number): boolean {
    return !!this.colorDevices.find((id => id === deviceId));
  }
}
