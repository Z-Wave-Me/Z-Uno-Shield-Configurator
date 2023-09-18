import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'configurator-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectorComponent {
  private readonly digitalInput = [
    {
      title: $localize`General purpose`,
      value: 'General purpose',
    },
    {
      title: $localize`Door/window`,
      value: 'door-window',
    },
    {
      title: $localize`Motion`,
      value: 'motion',
    },
    {
      title: $localize`Smoke`,
      value: 'Smoke',
    },
    {
      title: $localize`Leakage`,
      value: 'Leakage',
    },
    {
      title: $localize`CO`,
      value: 'CO',
    },
    {
      title: $localize`CO2`,
      value: 'CO2',
    },
    {
      title: $localize`Overheat`,
      value: 'Overheat',
    },
    {
      title: $localize`Freeze`,
      value: 'Freeze',
    },
    {
      title: $localize`Tamper`,
      value: 'Tamper',
    },
    {
      title: $localize`Tilt`,
      value: 'Tilt',
    },
    {
      title: $localize`Glass break`,
      value: 'Glass break',
    },
  ].map((data) => ({ ...data, withType: true }));

  private readonly digitalOutput = [
    {
      title: $localize`Switch`,
      value: 'switch',
    },
    {
      title: $localize`Door lock`,
      value: 'doorLock',
    },
    {
      title: $localize`Siren`,
      value: 'siren',
    },
    {
      title: $localize`Valve`,
      value: 'valve',
    },
    {
      title: $localize`Heating thermostat`,
      value: 'heatingThermostat',
      additionally: [
        {
          title: $localize`Z-Wave temp sensor`,
          value: 'Z-Wave temp sensor',
        },
        {
          title: $localize`DS18B20`,
          value: 'ds18b20',
        },
      ],
    },
    {
      title: $localize`Cooling thermostat`,
      value: 'coolingThermostat',
      additionally: [
        {
          title: $localize`Z-Wave temp sensor`,
          value: 'Z-Wave temp sensor',
        },
        {
          title: $localize`DS18B20`,
          value: 'ds18b20',
        },
      ],
    },
  ].map((data) => ({ ...data, withType: true }));

  private readonly analogInput = [
    {
      title: $localize`Percentages, %`,
      value: 'Percentages, %',
    },
    {
      title: $localize`Temperature, °C`,
      value: 'Temperature, °C',
    },
    {
      title: $localize`Luminance, lux`,
      value: 'Luminance, lux`',
    },
    {
      title: $localize`Humidity, %`,
      value: 'Humidity, %',
    },
    {
      title: $localize`Voltage, V`,
      value: 'Voltage, V',
    },
    {
      title: $localize`Current, A`,
      value: 'Current, A',
    },
    {
      title: $localize`Distance, m`,
      value: 'Distance, m',
    },
    {
      title: $localize`Pressure, kPa`,
      value: 'Pressure, kPa',
    },
    {
      title: $localize`CO2, ppm`,
      value: 'CO2, ppm',
    },
  ];

  private readonly analogOutput = [
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
  ];

  private readonly roter = [
    {
      title: $localize`9600 kbps`,
      value: '9600',
    },
    {
      title: $localize`14400 kbps`,
      value: '14400',
    },
    {
      title: $localize`19200 kbps`,
      value: '19200',
    },
    {
      title: $localize`38400 kbps`,
      value: '38400',
    },
    {
      title: $localize`57600 kbps`,
      value: '57600',
    },
    {
      title: $localize`115200 kbps`,
      value: '115200',
    },
    {
      title: $localize`230400 kbps`,
      value: '230400',
    },
  ];

  private readonly adcConfig = [
    {
      key: 'Analog input 0-3 V',
      title: $localize`Analog input 0-3 V`,
      options: this.analogInput,
    },
  ];

  private readonly gpioConfig = [
    {
      key: 'digital input',
      title: $localize`Digital input 0/3 V`,
      options: this.digitalInput,
    },
    {
      key: 'digital output',
      title: $localize`Digital output 0/3 V`,
      options: this.digitalOutput,
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
      options: [
        {
          title: $localize`1 sensor`,
          value: '1 sensor',
        },
        {
          title: $localize`2 sensors`,
          value: '2 sensors',
        },
        {
          title: $localize`3 sensors`,
          value: '3 sensors',
        },
        {
          title: $localize`4 sensors`,
          value: '4 sensors',
        },
        {
          title: $localize`5 sensors`,
          value: '5 sensors',
        },
        {
          title: $localize`6 sensors`,
          value: '6 sensors',
        },
        {
          title: $localize`7 sensors`,
          value: '7 sensors',
        },
        {
          title: $localize`8 sensors`,
          value: '8 sensors',
        },
        {
          title: $localize`9 sensors`,
          value: '9 sensors',
        },
        {
          title: $localize`10 sensors`,
          value: '10 sensors',
        },
      ],
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
          key: 'UART TX1',
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
          key: 'UART RX1',
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
          key: 'UART TX0',
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
          key: 'UART RX0',
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
