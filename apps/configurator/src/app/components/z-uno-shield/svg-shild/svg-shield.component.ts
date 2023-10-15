import { Component, ViewEncapsulation } from '@angular/core';
import { PinSelectedService } from '../../../services/pin-selected/pin-selected.service';
import { map, Observable, switchMap } from 'rxjs';
import {
  PinsStateService,
} from '../../../services/store/pins-state.service';
import { PinConfig } from '../../../../../../../libs/shared/src/lib/models/pin.config';

@Component({
  selector: 'configurator-svg-shield',
  templateUrl: './svg-shield.component.svg',
  styleUrls: ['./svg-shield.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class SvgShieldComponent {
  protected selectedPin$: Observable<PinConfig | undefined>;

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
        ),
      ),
    );
  }
}
