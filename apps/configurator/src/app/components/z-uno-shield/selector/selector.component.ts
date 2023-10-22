import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PinSelectedService } from '../../../services/pin-selected/pin-selected.service';
import { pinList } from '../z-uno-shield.config';

@Component({
  selector: 'configurator-zuno-shield-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectorComponent {
  public pinList = pinList;
  public topPinList = pinList.slice(0, 8);

  public bottomPinList = pinList.slice(8);

  constructor(private readonly pinSelectedService: PinSelectedService) {}

  public select(pinId: string): void {
    this.pinSelectedService.select(pinId);
  }
}
