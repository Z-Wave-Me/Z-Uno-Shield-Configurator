import { Component, ViewEncapsulation } from '@angular/core';
import { PinSelectedService } from '../../services/pin-selected/pin-selected.service';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'configurator-svg-shield',
  templateUrl: './svg-shield.component.svg',
  styleUrls: ['./svg-shield.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class SvgShieldComponent{
  protected selectedPin$: Observable<any>;

  constructor(
    private readonly pinSelectedService: PinSelectedService,
  ) {
    this.selectedPin$ = this.pinSelectedService.selectObserver.pipe(map(({id}) => id))
  }
}
