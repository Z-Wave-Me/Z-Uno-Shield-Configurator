import { AfterViewInit, Component, Input } from '@angular/core';
import { PinConfig } from '../../../../../services/store/pins-state.service';

@Component({
  selector: '[dht]',
  templateUrl: './dht.component.svg',
  styleUrls: ['./dht.component.scss'],
})
export class DhtComponent {

  @Input()
  public pin?: PinConfig;
}
