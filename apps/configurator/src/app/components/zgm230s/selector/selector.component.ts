import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DeviceType } from '../../../shared/device.model';
import { IO } from '../../../module/shared/models';

@Component({
  selector: 'configurator-selector',
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

  private readonly dhtConfig = [
    {
      key: 'temperature-humidity',
      title: $localize`Temperature/humidity`,
      options: [
        {
          title: $localize`DHT11`,
          value: 'dht11',
        },
        {
          title: $localize`DHT22`,
          value: 'dht22',
        },
      ],
    },
  ];

  private readonly ds18b20Config = [
    {
      key: 'Temperature',
      title: $localize`Temperature`,
      options: Array.from({ length: 10 }).map((_, index) => ({
        title: $localize`${index + 1} sensor`,
        value: index + 1,
        deviceType: DeviceType.DS18B20,
      })),
    },
  ];

  private readonly pwmConfig = [
    {
      key: 'PWM',
      title: $localize`PWM output `,
      options: [
        {
          title: $localize`Dimmer`,
          value: 'dimmer',
        },
        {
          title: $localize`Red LED`,
          value: 'led red',
        },
        {
          title: $localize`Green LED`,
          value: 'led green',
        },
        {
          title: $localize`Blue LED`,
          value: 'led blue',
        },
        {
          title: $localize`White LED`,
          value: 'led white',
        },
      ],
    },
  ];

  public pins = [
    {
      title: 'PA00',
      id: 'PA00',
      pin: [
        {
          key: 'SPI SCK',
          title: $localize`SPI SCK`,
          options: this.roter,
        },
        ...this.gpioConfig,
      ],
    },
    {
      title: 'PA01',
      id: 'PA01',
      pin: [
        {
          key: 'SPI MISO',
          title: $localize`SPI MISO`,
          options: this.roter,
        },
        ...this.gpioConfig,
      ],
    },
    {
      title: 'PA02',
      id: 'PA02',
      pin: [
        {
          key: 'SPI MOSI',
          title: $localize`SPI MOSI`,
          options: this.roter,
        },
        ...this.gpioConfig,
      ],
    },
    {
      title: 'PA03',
      id: 'PA03',
      pin: [...this.adcConfig, ...this.gpioConfig],
    },
    {
      title: 'PA04',
      id: 'PA04',
      pin: [...this.adcConfig, ...this.gpioConfig],
    },
    {
      title: 'PA05',
      id: 'PA05',
      pin: [...this.adcConfig, ...this.gpioConfig],
    },
    {
      title: 'PC08',
      id: 'PC08',
      pin: [...this.adcConfig, ...this.gpioConfig],
    },
    {
      title: 'PA09',
      id: 'PA09',
      pin: [
        {
          key: 'uart',
          title: $localize`UART TX1`,
          options: this.roter,
        },
        ...this.gpioConfig,
      ],
    },
    {
      title: 'PA08',
      id: 'PA08',
      pin: [
        {
          key: 'uart',
          title: $localize`UART RX1`,
          options: this.roter,
        },
        ...this.gpioConfig,
      ],
    },
    {
      title: 'PC09',
      id: 'PC09',
      pin: [...this.ds18b20Config, ...this.dhtConfig, ...this.gpioConfig],
    },
    {
      title: 'PA10',
      id: 'PA10',
      pin: [...this.ds18b20Config, ...this.dhtConfig, ...this.gpioConfig],
    },
    {
      title: 'PC01',
      id: 'PC01',
      pin: [...this.ds18b20Config, ...this.dhtConfig, ...this.gpioConfig],
    },
    {
      title: 'PC05',
      id: 'PC05',
      pin: [...this.ds18b20Config, ...this.dhtConfig, ...this.gpioConfig],
    },
    {
      title: 'PA06',
      id: 'PA06',
      pin: [
        ...this.pwmConfig,
        ...this.ds18b20Config,
        ...this.dhtConfig,
        ...this.gpioConfig,
      ],
    },
    {
      title: 'PB03',
      id: 'PB03',
      pin: [
        ...this.pwmConfig,
        ...this.ds18b20Config,
        ...this.dhtConfig,
        ...this.gpioConfig,
      ],
    },
    {
      title: 'PB04',
      id: 'PB04',
      pin: [
        ...this.pwmConfig,
        ...this.ds18b20Config,
        ...this.dhtConfig,
        ...this.gpioConfig,
      ],
    },
    {
      title: 'PB05',
      id: 'PB05',
      pin: [
        ...this.pwmConfig,
        ...this.ds18b20Config,
        ...this.dhtConfig,
        ...this.gpioConfig,
      ],
    },

    {
      title: 'PB06',
      id: 'PB06',
      pin: this.gpioConfig,
    },
    {
      title: 'PC00',
      id: 'PC00',
      pin: this.gpioConfig,
    },
    {
      title: 'PC06',
      id: 'PC06',
      pin: this.gpioConfig,
    },
    {
      title: 'PC02',
      id: 'PC02',
      pin: this.gpioConfig,
    },
    {
      title: 'PC03',
      id: 'PC03',
      pin: this.gpioConfig,
    },
    {
      title: 'PC04',
      id: 'PC04',
      pin: this.gpioConfig,
    },
    {
      title: 'PB01',
      id: 'PB01',
      pin: this.gpioConfig,
    },
    {
      title: 'PB00',
      id: 'PB00',
      pin: [
        {
          key: 'uart',
          title: $localize`UART TX0`,
          options: this.roter,
        },
        ...this.gpioConfig,
      ],
    },
    {
      title: 'PD02',
      id: 'PD02',
      pin: [
        {
          key: 'uart',
          title: $localize`UART RX0`,
          options: this.roter,
        },
        ...this.gpioConfig,
      ],
    },
    {
      title: 'PD00',
      id: 'PD00',
      pin: [
        {
          key: 'SAPI TX',
          title: $localize`SAPI TX`,
          options: this.roter,
        },
      ],
    },
    {
      title: 'PD01',
      id: 'PD01',
      pin: [
        {
          key: 'SAPI RX',
          title: $localize`SAPI RX`,
          options: this.roter,
        },
      ],
    },
    {
      title: 'PB02',
      id: 'PB02',
      pin: [
        {
          key: 'SYSTEM LED1',
          title: $localize`SYSTEM LED1`,
        },
        ...this.gpioConfig,
      ],
    },
    {
      title: 'PD03',
      id: 'PD03',
      pin: [
        {
          key: 'SYSTEM LED2',
          title: $localize`SYSTEM LED2`,
        },
        ...this.gpioConfig,
      ],
    },
  ];

  public select(id: string): void {
    console.log(id);
  }
}