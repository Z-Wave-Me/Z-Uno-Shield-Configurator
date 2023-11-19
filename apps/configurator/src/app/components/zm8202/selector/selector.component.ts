import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IO } from '../../../module/shared/models';
import { DeviceType } from '@configurator/shared';
import { Zm8202Pin, Zm9202Group } from '../zm8202.model';
import { Pin } from '../../z-uno-shield/z-uno-shield.model';
import { VoltageOffset } from '@configurator/arduino-code-gen';

@Component({
  selector: 'configurator-zm8202-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectorComponent {
  private readonly adcConfig = [
    {
      key: '0V-3V',
      title: $localize`Analog input 0-3 V`,
      options: IO.analogInput,
      offset: VoltageOffset.V3,
    },
  ];

  private readonly gpioConfig = [
    {
      key: 'digital input',
      title: $localize`Digital input 0/3 V`,
      options: IO.digitalInput,
    },
    {
      key: 'digital output',
      title: $localize`Digital output 0/3 V`,
      options: IO.digitalOutput,
    },
  ];

  private readonly pwmConfig = [
    {
      key: 'PWM',
      title: $localize`PWM output `,
      options: IO.analogOutput,
    },
  ];

  public pins: Pin[] = [
    {
      title: 'PA00',
      id: Zm8202Pin.PA00,
      pin: [
        {
          key: 'SPI',
          title: $localize`SPI SCK`,
          options: IO.roter(DeviceType.UART),
          group: Zm9202Group.SPI,
        },
        ...this.gpioConfig,
      ],
    },
    {
      title: 'PA01',
      id: Zm8202Pin.PA01,
      pin: [
        {
          key: 'SPI',
          title: $localize`SPI MISO`,
          options: IO.roter(DeviceType.UART),
          group: Zm9202Group.SPI,
        },
        ...this.gpioConfig,
      ],
    },
    {
      title: 'PA02',
      id: Zm8202Pin.PA02,
      pin: [
        {
          key: 'SPI',
          title: $localize`SPI MOSI`,
          options: IO.roter(DeviceType.UART),
          group: Zm9202Group.SPI,
        },
        ...this.gpioConfig,
      ],
    },
    {
      title: 'PA03',
      id: Zm8202Pin.PA03,
      pin: [...this.adcConfig, ...this.gpioConfig],
    },
    {
      title: 'PA04',
      id: Zm8202Pin.PA04,
      pin: [...this.adcConfig, ...this.gpioConfig],
    },
    {
      title: 'PA05',
      id: Zm8202Pin.PA05,
      pin: [...this.adcConfig, ...this.gpioConfig],
    },
    {
      title: 'PA06',
      id: Zm8202Pin.PA06,
      pin: [
        ...this.pwmConfig,
        ...IO.ds18b20,
        ...IO.temperatureHumidity,
        ...this.gpioConfig,
      ],
    },
    {
      title: 'PB01',
      id: Zm8202Pin.PB01,
      pin: this.gpioConfig,
    },
    {
      title: 'PC00',
      id: Zm8202Pin.PC00,
      pin: this.gpioConfig,
    },
    {
      title: 'PC05',
      id: Zm8202Pin.PC05,
      pin: [...IO.ds18b20, ...IO.temperatureHumidity, ...this.gpioConfig],
    },
  ];

  public select(id: string): void {
    console.log(id);
  }
}
