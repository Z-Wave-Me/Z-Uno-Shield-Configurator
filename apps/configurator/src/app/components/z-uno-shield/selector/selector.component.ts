import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PinSelectedService } from '../../../services/pin-selected/pin-selected.service';
import { IO } from '../../../module/shared/models';
import { DeviceType } from '@configurator/shared';

@Component({
  selector: 'configurator-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectorComponent {

  public topPinList = [
    {
      title: 'PWM4',
      id: 'pwm4',
      pin: [
        {
          key: 'PWM',
          title: $localize`PWM output`,
          options: IO.pwmOutput,
        },
        {
          key: 'digital',
          title: $localize`Digital output`,
          options: IO.digitalOutput,
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
          options: IO.pwmOutput,
        },
        {
          key: 'digital',
          title: $localize`Digital output `,
          options: IO.digitalOutput,
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
          options: IO.pwmOutput,
        },
        {
          key: 'digital',
          title: $localize`Digital output `,
          options: IO.digitalOutput,
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
          options: IO.pwmOutput,
        },
        {
          key: 'digital',
          title: $localize`Digital output `,
          options: IO.digitalOutput,
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
              type: DeviceType.SwitchMultilevel,
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
              type: DeviceType.SwitchMultilevel,
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
              type: DeviceType.SwitchMultilevel,
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
              type: DeviceType.SwitchMultilevel,
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
          key: 'uart',
          title: $localize`UART TX`,
          options: IO.roter(DeviceType.UART, '8'),
        },
        {
          key: 'RS-485',
          title: $localize`RS-485 A`,
          options: IO.roter(DeviceType.RS485, '8'),
        },
        {
          key: 'digital input',
          title: $localize`Digital input 0/3 V`,
          withGround: 3,
          options: IO.digitalInput,
        },
        {
          key: 'digital output',
          title: $localize`Digital output 0/3 V`,
          options: IO.digitalOutput,
        },
      ],
    },
    {
      title: '8, RS-B',
      id: '8',
      pin: [
        {
          key: 'uart',
          title: $localize`UART RX`,
          options: IO.roter(DeviceType.UART, '7'),
        },
        {
          key: 'RS-485',
          title: $localize`RS-485 B`,
          options: IO.roter(DeviceType.RS485, '7'),
        },
        {
          key: 'digital input',
          title: $localize`Digital input 0/3 V`,
          withGround: 3,
          options: IO.digitalInput,
        },
        {
          key: 'digital output',
          title: $localize`Digital output 0/3 V`,
          options: IO.digitalOutput,
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
          options: IO.digitalInput,
        },
        {
          key: 'digital output',
          title: $localize`Digital output 0/3 V`,
          options: IO.digitalOutput,
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
          options: Array.from({ length: 10 }).map((_, index) => ({
            title: $localize`${index + 1} sensor`,
            value: index + 1,
            type: DeviceType.DS18B20,
          })),
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
          options: IO.digitalInput,
        },
        {
          key: 'digital output',
          title: $localize`Digital output 0/3 V `,
          options: IO.digitalOutput,
        },
      ],
    },

    {
      title: 'ADC3',
      id: 'adc3',
      pin: IO.adcConfig,
    },
    {
      title: 'ADC2',
      id: 'adc2',
      pin: IO.adcConfig,
    },
    {
      title: 'ADC1',
      id: 'adc1',
      pin: IO.adcConfig,
    },
    {
      title: 'ADC0',
      id: 'adc0',
      pin: IO.adcConfig,
    },
  ];

  constructor(private readonly pinSelectedService: PinSelectedService) {}

  public select(pinId: string): void {
    this.pinSelectedService.select(pinId);
  }
}
