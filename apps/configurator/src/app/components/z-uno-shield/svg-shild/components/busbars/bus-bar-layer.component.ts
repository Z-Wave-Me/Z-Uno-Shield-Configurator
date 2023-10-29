import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { PinConfig } from '@configurator/shared';
import { PinsStateService } from '../../../../../services/store/pins-state.service';

@Component({
  selector: '[bus-bar-layer]',
  templateUrl: './bus-bar-layer.component.svg',
  styleUrls: ['./bus-bar-layer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BusBarLayerComponent {
  protected selectedBuses$: Observable<PinConfig[] | undefined>;

  constructor(
    private readonly pinsStateService: PinsStateService,
  ) {
    this.selectedBuses$ =  this.pinsStateService.state$;

  }
}
