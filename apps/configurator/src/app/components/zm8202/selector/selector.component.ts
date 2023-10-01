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
      title: 'PB01',
      id: 'PB01',
      pin: this.gpioConfig,
    },
    {
      title: 'PC00',
      id: 'PC00',
      pin: this.gpioConfig,
    },
    {
      title: 'PC05',
      id: 'PC05',
      pin: [...this.ds18b20Config, ...this.dhtConfig, ...this.gpioConfig],
    },
  ];

  public select(id: string): void {
    console.log(id);
  }
}
