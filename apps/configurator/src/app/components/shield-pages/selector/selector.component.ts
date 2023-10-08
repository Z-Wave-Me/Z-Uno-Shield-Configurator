import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PinSelectedService } from '../../../services/pin-selected/pin-selected.service';
import { DeviceType } from '../../../shared/device.model';

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
      type: DeviceType.SensorBinary,
    },
    {
      title: $localize`Door/window`,
      value: 'door-window',
    },
    {
      title: $localize`Motion`,
      value: 'motion',
      type: DeviceType.SensorBinary,
    },
    {
      title: $localize`Smoke`,
      value: 'Smoke',
      type: DeviceType.SensorBinary,
    },
    {
      title: $localize`Leakage`,
      value: 'Leakage',
      type: DeviceType.SensorBinary,
    },
    {
      title: $localize`CO`,
      value: 'CO',
      type: DeviceType.SensorBinary,
    },
    {
      title: $localize`CO2`,
      value: 'CO2',
      type: DeviceType.SensorBinary,
    },
    {
      title: $localize`Overheat`,
      value: 'Overheat',
    },
    {
      title: $localize`Freeze`,
      value: 'Freeze',
      type: DeviceType.SensorBinary,
    },
    {
      title: $localize`Tamper`,
      value: 'Tamper',
      type: DeviceType.SensorBinary,
    },
    {
      title: $localize`Tilt`,
      value: 'Tilt',
      type: DeviceType.SensorBinary,
    },
    {
      title: $localize`Glass break`,
      value: 'Glass break',
      type: DeviceType.SensorBinary,
    },
  ].map((data) => ({ ...data, withType: true }));

  private readonly digitalOutput = [
    {
      title: $localize`Switch`,
      value: 'switch',
      type: DeviceType.SwitchBinary,
    },
    {
      title: $localize`Door lock`,
      value: 'doorLock',
      type: DeviceType.SwitchBinary,
    },
    {
      title: $localize`Siren`,
      value: 'siren',
      type: DeviceType.SwitchBinary,
    },
    {
      title: $localize`Valve`,
      value: 'valve',
      type: DeviceType.SwitchBinary,
    },
    {
      title: $localize`Heating thermostat`,
      value: 'heatingThermostat',
      type: DeviceType.Thermostat,
      additionally: [
        {
          title: $localize`Z-Wave temp sensor`,
          value: 'Z-Wave temp sensor',
        },
        {
          title: $localize`DS18B20`,
          value: 'ds18b20',
          type: DeviceType.DS18B20,
        },
      ],
    },
    {
      title: $localize`Cooling thermostat`,
      value: 'coolingThermostat',
      type: DeviceType.Thermostat,
      additionally: [
        {
          title: $localize`Z-Wave temp sensor`,
          value: 'Z-Wave temp sensor',
        },
        {
          title: $localize`DS18B20`,
          value: 'ds18b20',
          type: DeviceType.DS18B20,
        },
      ],
    },
  ].map((data) => ({ ...data, withType: true }));

  private readonly pwmOutput = [
    {
      title: $localize`Dimmer`,
      value: 'dimmer',
    },
    {
      title: $localize`Red LED`,
      value: 'led red',
      type: DeviceType.SwitchColor,
    },
    {
      title: $localize`Green LED`,
      value: 'led green',
      type: DeviceType.SwitchColor,
    },
    {
      title: $localize`Blue LED`,
      value: 'led blue',
      type: DeviceType.SwitchColor,
    },
    {
      title: $localize`White LED`,
      value: 'led white',
      type: DeviceType.SwitchColor,
    },
  ];

  private readonly analogInput = [
    {
      title: $localize`Percentages, %`,
      value: 'Percentages, %',
      type: DeviceType.SensorMultilevel,
    },
    {
      title: $localize`Temperature, °C`,
      value: 'Temperature, °C',
      type: DeviceType.SensorMultilevel,
    },
    {
      title: $localize`Luminance, lux`,
      value: 'Luminance, lux`',
      type: DeviceType.SensorMultilevel,
    },
    {
      title: $localize`Humidity, %`,
      value: 'Humidity, %',
      type: DeviceType.SensorMultilevel,
    },
    {
      title: $localize`Voltage, V`,
      value: 'Voltage, V',
      type: DeviceType.SensorMultilevel,
    },
    {
      title: $localize`Current, A`,
      value: 'Current, A',
      type: DeviceType.SensorMultilevel,
    },
    {
      title: $localize`Distance, m`,
      value: 'Distance, m',
      type: DeviceType.SensorMultilevel,
    },
    {
      title: $localize`Pressure, kPa`,
      value: 'Pressure, kPa',
      type: DeviceType.SensorMultilevel,
    },
    {
      title: $localize`CO2, ppm`,
      value: 'CO2, ppm',
      type: DeviceType.SensorMultilevel,
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
      type: DeviceType.SwitchColor,
    },
    {
      title: $localize`Green LED`,
      value: 'led green',
      type: DeviceType.SwitchColor,
    },
    {
      title: $localize`Blue LED`,
      value: 'led blue',
      type: DeviceType.SwitchColor,
    },
    {
      title: $localize`White LED`,
      value: 'led white',
      type: DeviceType.SwitchColor,
    },
  ];

  private readonly roter = [
    {
      title: $localize`9600 kbps`,
      value: '9600',
      type: DeviceType.UART,
    },
    {
      title: $localize`14400 kbps`,
      value: '14400',
      type: DeviceType.UART,
    },
    {
      title: $localize`19200 kbps`,
      value: '19200',
      type: DeviceType.UART,
    },
    {
      title: $localize`38400 kbps`,
      value: '38400',
      type: DeviceType.UART,
    },
    {
      title: $localize`57600 kbps`,
      value: '57600',
      type: DeviceType.UART,
    },
    {
      title: $localize`115200 kbps`,
      value: '115200',
      type: DeviceType.UART,
    },
    {
      title: $localize`230400 kbps`,
      value: '230400',
      type: DeviceType.UART,
    },
  ];

  private readonly adcConfig = [
    {
      key: 'Analog input 0-3 V',
      title: $localize`Analog input 0-3 V`,
      options: this.analogInput,
      map: 3,
    },
    {
      key: 'Analog input 0-5 V',
      title: $localize`Analog input 0-5 V`,
      options: this.analogInput,
      map: 5,
    },
    {
      key: 'Analog input 0-12 V',
      title: $localize`Analog input 0-12 V`,
      options: this.analogInput,
      map: 12,
    },
    {
      key: 'Digital input 0/3 V',
      title: $localize`Digital input 0/3 V`,
      withGround: 3,
      options: this.digitalInput,
    },
    {
      key: 'Digital input 0/5 V',
      title: $localize`Digital input 0/5 V`,
      withGround: 5,
      options: this.digitalInput,
    },
    {
      key: 'Digital input 0/12 V',
      title: $localize`Digital input 0/12 V`,
      withGround: 12,
      options: this.digitalInput,
    },
    {
      key: 'Digital output 0/3 V',
      title: $localize`Digital output 0/3 V`,
      options: this.digitalOutput,
    },
  ];

  public topPinList = [
    {
      title: 'PWM4',
      id: 'pwm4',
      pin: [
        {
          key: 'PWM',
          title: $localize`PWM output`,
          options: this.pwmOutput,
        },
        {
          key: 'digital',
          title: $localize`Digital output`,
          options: this.digitalOutput,
        },
      ],
    },

    {
      title: 'PWM3',
      id: 'pwm3',
      pin: [
        {
          key: 'PWM',
          title: $localize`PWM output `,
          options: this.pwmOutput,
        },
        {
          key: 'digital',
          title: $localize`Digital output `,
          options: this.digitalOutput,
        },
      ],
    },
    {
      title: 'PWM2',
      id: 'pwm2',
      pin: [
        {
          key: 'PWM',
          title: $localize`PWM output `,
          options: this.pwmOutput,
        },
        {
          key: 'digital',
          title: $localize`Digital output `,
          options: this.digitalOutput,
        },
      ],
    },
    {
      title: 'PWM1',
      id: 'pwm1',
      pin: [
        {
          key: 'PWM',
          title: $localize`PWM output `,
          options: this.pwmOutput,
        },
        {
          key: 'digital',
          title: $localize`Digital output `,
          options: this.digitalOutput,
        },
      ],
    },
    {
      title: '0-10V_1',
      id: '0-10V_1',
      pin: [
        {
          key: '0-10V',
          title: $localize`Analog output 0-10V`,
          options: [
            {
              title: $localize`Dimmer`,
              value: '0-10v',
            },
          ],
        },
      ],
    },
    {
      title: '0-10V_2',
      id: '0-10V_2',
      pin: [
        {
          key: '0-10V',
          title: $localize`Analog output 0-10V`,
          options: [
            {
              title: $localize`Dimmer`,
              value: '0-10v',
            },
          ],
        },
      ],
    },
    {
      title: '0-10V_3',
      id: '0-10V_3',
      pin: [
        {
          key: '0-10V',
          title: $localize`Analog output 0-10V`,
          options: [
            {
              title: $localize`Dimmer`,
              value: '0-10v',
            },
          ],
        },
      ],
    },
    {
      title: '0-10V_4',
      id: '0-10V_4',
      pin: [
        {
          key: '0-10V',
          title: $localize`Analog output 0-10V`,
          options: [
            {
              title: $localize`Dimmer`,
              value: '0-10v',
            },
          ],
        },
      ],
    },
  ];

  public bottomPinList = [
    {
      title: '7, RS-A',
      id: '7',
      pin: [
        {
          key: 'UART TX',
          title: $localize`UART TX`,
          options: this.roter,
        },
        {
          key: 'RS-485 A',
          title: $localize`RS-485 A`,
          options: this.roter,
        },
        {
          key: 'digital input',
          title: $localize`Digital input 0/3 V`,
          withGround: 3,
          options: this.digitalInput,
        },
        {
          key: 'digital output',
          title: $localize`Digital output 0/3 V`,
          options: this.digitalOutput,
        },
      ],
    },
    {
      title: '8, RS-B',
      id: '8',
      pin: [
        {
          key: 'UART RX',
          title: $localize`UART RX`,
          options: this.roter,
        },
        {
          key: 'RS-485 B',
          title: $localize`RS-485 B`,
          options: this.roter,
        },
        {
          key: 'digital input',
          title: $localize`Digital input 0/3 V`,
          withGround: 3,
          options: this.digitalInput,
        },
        {
          key: 'digital output',
          title: $localize`Digital output 0/3 V`,
          options: this.digitalOutput,
        },
      ],
    },
    {
      title: '12',
      id: '12',
      pin: [
        {
          key: 'temperature-humidity',
          title: $localize`Temperature/humidity`,
          options: [
            {
              title: $localize`DHT11`,
              value: 'dht11',
              type: DeviceType.DHT,
            },
            {
              title: $localize`DHT22`,
              value: 'dht22',
              type: DeviceType.DHT,
            },
          ],
        },
        {
          key: 'digital input',
          title: $localize`Digital input 0/3 V`,
          withGround: 3,
          options: this.digitalInput,
        },
        {
          key: 'digital output',
          title: $localize`Digital output 0/3 V`,
          options: this.digitalOutput,
        },
      ],
    },

    {
      title: '11, One Wire',
      id: '11',
      pin: [
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
        {
          key: 'temperature-humidity',
          title: $localize`Temperature/humidity`,
          options: [
            {
              title: $localize`DHT11`,
              value: 'dht11',
              type: DeviceType.DHT,
            },
            {
              title: $localize`DHT22`,
              value: 'dht22',
              type: DeviceType.DHT,
            },
          ],
        },
        {
          key: 'digital input',
          title: $localize`Digital input 0/3 V`,
          withGround: 3,
          options: this.digitalInput,
        },
        {
          key: 'digital output',
          title: $localize`Digital output 0/3 V `,
          options: this.digitalOutput,
        },
      ],
    },

    {
      title: 'ADC3',
      id: 'adc3',
      pin: this.adcConfig,
    },
    {
      title: 'ADC2',
      id: 'adc2',
      pin: this.adcConfig,
    },
    {
      title: 'ADC1',
      id: 'adc1',
      pin: this.adcConfig,
    },
    {
      title: 'ADC0',
      id: 'adc0',
      pin: this.adcConfig,
    },
  ];

  constructor(private readonly pinSelectedService: PinSelectedService) {}

  public select(pinId: string): void {
    this.pinSelectedService.select(pinId);
  }
}
