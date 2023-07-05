import { AfterViewInit, Component, Input } from '@angular/core';
import { PinConfig } from '../../../../../services/store/pins-state.service';

@Component({
  selector: '[dht22]',
  templateUrl: './dht22.component.svg',
  styleUrls: ['./dht22.component.scss'],
})
export class Dht22Component {

  @Input()
  public pin?: PinConfig;
}
