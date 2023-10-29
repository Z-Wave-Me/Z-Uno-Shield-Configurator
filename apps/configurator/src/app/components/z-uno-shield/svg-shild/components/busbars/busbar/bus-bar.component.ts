import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ZUnoShieldPin } from '../../../../z-uno-shield.model';
import { PinConfig } from '@configurator/shared';

const adcOffsets = (position: number): number => ({
  0: -548,
  1: -508,
  2: -468,
  3: -428,
})[position] ?? 0;

const horizontalOffsets: Record<string, (position: number) => string> = {
  [ZUnoShieldPin.ADC0]: (position: number) => `-82 ${adcOffsets(position)}`,
  [ZUnoShieldPin.ADC1]: (position: number) => `-233 ${adcOffsets(position)}`,
  [ZUnoShieldPin.ADC2]: (position: number) => `-383 ${adcOffsets(position)}`,
  [ZUnoShieldPin.ADC3]: (position: number) => `-531 ${adcOffsets(position)}`,
}




@Component({
  selector: '[bus-bar]',
  templateUrl: './bus-bar.component.svg',
  styleUrls: ['./bus-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BusBarComponent {
  @Input()
  public fill = 'rgb(0,0,255)';

  @Input()
  public stroke = '';

  @Input()
  public pin?: PinConfig;

  public get busBar(): number[] | undefined {
    return this.pin?.busBars;
  }

  public transform(position: number): string {
    return `translate(${horizontalOffsets[this.pin?.id ?? ''](position)})`;
  }
}
