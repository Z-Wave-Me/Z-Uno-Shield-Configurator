import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ZUnoShieldPin } from '../../../../z-uno-shield.model';
import { PinConfig } from '@configurator/shared';

const adcOffsets = (position: number): number => ({
  0: -548,
  1: -508,
  2: -468,
  3: -428,
})[position] ?? 0;

const defaultOffsets = (position: number): string => {
  switch (position) {
    case 0:
    case 1:
      return `translate(${3279 + 37 * position} -1210) rotate(90)`;
    case 2:
    case 3:
    case 4:
      return `translate(-444 ${-1489 + 40 * position})`
    default:
      return '';
  }
}

const rsaOffsets = (position:number): string  => {
  switch (position) {
    case 0:
    case 1:
    case 2:
    case 3:
      return `translate(${-820 + (position >> 1) * 30} ${-783 + (position & 1) * 40})`;
    case 4:
    case 5:
      return `translate(${3078 + 37 * position} -410) rotate(90)`;
    case 6:
    case 7:
      return `translate(${2863 + 37 * position} -188) rotate(90)`;
    default:
      return '';
  }
}

const horizontalOffsets: Record<string, (position: number) => string> = {
  [ZUnoShieldPin.ADC0]: (position: number) => `translate(-82 ${adcOffsets(position)})`,
  [ZUnoShieldPin.ADC1]: (position: number) => `translate(-233 ${adcOffsets(position)})`,
  [ZUnoShieldPin.ADC2]: (position: number) => `translate(-383 ${adcOffsets(position)})`,
  [ZUnoShieldPin.ADC3]: (position: number) => `translate(-531 ${adcOffsets(position)})`,
  default: defaultOffsets,
  [ZUnoShieldPin.RS_A]: rsaOffsets,
  [ZUnoShieldPin.RS_B]: rsaOffsets,
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
    return `${horizontalOffsets[this.pin?.id ?? ''](position)}`;
  }
}
