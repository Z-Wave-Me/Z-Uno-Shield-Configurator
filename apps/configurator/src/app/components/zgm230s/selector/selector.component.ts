import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IO } from '../../../module/shared/models';
import { DeviceType } from '@configurator/shared';
import { Zgm230sGroups, Zgm230sPin } from '../zgm230s.model';
import { Pin } from '../../z-uno-shield/z-uno-shield.model';

@Component({
  selector: 'configurator-zgm230s-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectorComponent {
  private readonly adcConfig = [
    {
      key: 'Analog input 0-3 V',
      title: $localize`Analog input 0-3 V`,
      options: IO.analogInput,
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
      id: Zgm230sPin.PA00,
      pin: [
        {
          key: 'SPI',
          title: $localize`SPI SCK`,
          options: IO.roter(DeviceType.UART),
          group: Zgm230sGroups.SPI,
        },
        ...this.gpioConfig,
      ],
    },
    {
      title: 'PA01',
      id: Zgm230sPin.PA01,
      pin: [
        {
          key: 'SPI',
          title: $localize`SPI MISO`,
          options: IO.roter(DeviceType.UART),
          group: Zgm230sGroups.SPI,
        },
        ...this.gpioConfig,
      ],
    },
    {
      title: 'PA02',
      id: Zgm230sPin.PA02,
      pin: [
        {
          key: 'SPI',
          title: $localize`SPI MOSI`,
          options: IO.roter(DeviceType.UART),
          group: Zgm230sGroups.SPI,
        },
        ...this.gpioConfig,
      ],
    },
    {
      title: 'PA03',
      id: Zgm230sPin.PA03,
      pin: [...this.adcConfig, ...this.gpioConfig],
    },
    {
      title: 'PA04',
      id: Zgm230sPin.PA04,
      pin: [...this.adcConfig, ...this.gpioConfig],
    },
    {
      title: 'PA05',
      id: Zgm230sPin.PA05,
      pin: [...this.adcConfig, ...this.gpioConfig],
    },
    {
      title: 'PC08',
      id: Zgm230sPin.PC08,
      pin: [...this.adcConfig, ...this.gpioConfig],
    },
    {
      title: 'PA09',
      id: Zgm230sPin.PA09,
      pin: [
        {
          key: 'uart',
          title: $localize`UART TX1`,
          options: IO.roter(DeviceType.UART),
          group: Zgm230sGroups.UartX1,
        },
        ...this.gpioConfig,
      ],
    },
    {
      title: 'PA08',
      id: Zgm230sPin.PA08,
      pin: [
        {
          key: 'uart',
          title: $localize`UART RX1`,
          options: IO.roter(DeviceType.UART),
          group: Zgm230sGroups.UartX1,
        },
        ...this.gpioConfig,
      ],
    },
    {
      title: 'PC09',
      id: Zgm230sPin.PC09,
      pin: [...IO.ds18b20, ...IO.temperatureHumidity, ...this.gpioConfig],
    },
    {
      title: 'PA10',
      id: Zgm230sPin.PA10,
      pin: [...IO.ds18b20, ...IO.temperatureHumidity, ...this.gpioConfig],
    },
    {
      title: 'PC01',
      id: Zgm230sPin.PC01,
      pin: [...IO.ds18b20, ...IO.temperatureHumidity, ...this.gpioConfig],
    },
    {
      title: 'PC05',
      id: Zgm230sPin.PC05,
      pin: [...IO.ds18b20, ...IO.temperatureHumidity, ...this.gpioConfig],
    },
    {
      title: 'PA06',
      id: Zgm230sPin.PA06,
      pin: [
        ...this.pwmConfig,
        ...IO.ds18b20,
        ...IO.temperatureHumidity,
        ...this.gpioConfig,
      ],
    },
    {
      title: 'PB03',
      id: Zgm230sPin.PB03,
      pin: [
        ...this.pwmConfig,
        ...IO.ds18b20,
        ...IO.temperatureHumidity,
        ...this.gpioConfig,
      ],
    },
    {
      title: 'PB04',
      id: Zgm230sPin.PB04,
      pin: [
        ...this.pwmConfig,
        ...IO.ds18b20,
        ...IO.temperatureHumidity,
        ...this.gpioConfig,
      ],
    },
    {
      title: 'PB05',
      id: Zgm230sPin.PB05,
      pin: [
        ...this.pwmConfig,
        ...IO.ds18b20,
        ...IO.temperatureHumidity,
        ...this.gpioConfig,
      ],
    },

    {
      title: 'PB06',
      id: Zgm230sPin.PB06,
      pin: this.gpioConfig,
    },
    {
      title: 'PC00',
      id: Zgm230sPin.PC00,
      pin: this.gpioConfig,
    },
    {
      title: 'PC06',
      id: Zgm230sPin.PC06,
      pin: this.gpioConfig,
    },
    {
      title: 'PC02',
      id: Zgm230sPin.PC02,
      pin: this.gpioConfig,
    },
    {
      title: 'PC03',
      id: Zgm230sPin.PC03,
      pin: this.gpioConfig,
    },
    {
      title: 'PC04',
      id: Zgm230sPin.PC04,
      pin: this.gpioConfig,
    },
    {
      title: 'PB01',
      id: Zgm230sPin.PB01,
      pin: this.gpioConfig,
    },
    {
      title: 'PB00',
      id: Zgm230sPin.PB00,
      pin: [
        {
          key: 'uart',
          title: $localize`UART TX0`,
          options: IO.roter(DeviceType.UART),
          group: Zgm230sGroups.UartX0,
        },
        ...this.gpioConfig,
      ],
    },
    {
      title: 'PD02',
      id: Zgm230sPin.PD02,
      pin: [
        {
          key: 'uart',
          title: $localize`UART RX0`,
          options: IO.roter(DeviceType.UART),
          group: Zgm230sGroups.UartX0,
        },
        ...this.gpioConfig,
      ],
    },
    {
      title: 'PD00',
      id: Zgm230sPin.PD00,
      pin: [
        {
          key: 'SAPI',
          title: $localize`SAPI TX`,
          options: IO.roter(DeviceType.UART),
          group: Zgm230sGroups.SAPI,
        },
      ],
    },
    {
      title: 'PD01',
      id: Zgm230sPin.PD01,
      pin: [
        {
          key: 'SAPI',
          title: $localize`SAPI RX`,
          options: IO.roter(DeviceType.UART),
          group: Zgm230sGroups.SAPI,
        },
      ],
    },
    {
      title: 'PB02',
      id: Zgm230sPin.PB02,
      pin: [
        // TODO what is this
        // {
        //   key: 'SYSTEM LED1',
        //   title: $localize`SYSTEM LED1`,
        // },
        ...this.gpioConfig,
      ],
    },
    {
      title: 'PD03',
      id: Zgm230sPin.PD03,
      pin: [
        // TODO what is this
        // {
        //   key: 'SYSTEM LED2',
        //   title: $localize`SYSTEM LED2`,
        // },
        ...this.gpioConfig,
      ],
    },
  ];

  public select(id: string): void {
    console.log(id);
  }
}
