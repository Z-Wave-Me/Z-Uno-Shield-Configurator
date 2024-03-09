import { Pin, ZUnoDeviceGroup, ZUnoShieldPin } from './z-uno-shield.model';
import { IO } from '../../module/shared/models';
import { DeviceType } from '@configurator/shared';

export const pinList: Pin[] = [
  {
    title: 'PWM4',
    id: ZUnoShieldPin.PWM4,
    pin: [
      {
        key: 'PWM',
        title: $localize`PWM output`,
        options: IO.analogOutput,
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
    id: ZUnoShieldPin.PWM3,
    pin: [
      {
        key: 'PWM',
        title: $localize`PWM output`,
        options: IO.analogOutput,
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
    id: ZUnoShieldPin.PWM2,
    pin: [
      {
        key: 'PWM',
        title: $localize`PWM output`,
        options: IO.analogOutput,
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
    id: ZUnoShieldPin.PWM1,
    pin: [
      {
        key: 'PWM',
        title: $localize`PWM output`,
        options: IO.analogOutput,
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
    id: ZUnoShieldPin.V10_1,
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
    id: ZUnoShieldPin.V10_2,
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
    id: ZUnoShieldPin.V10_3,
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
    id: ZUnoShieldPin.V10_4,
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
    title: '7, RS-A',
    id: ZUnoShieldPin.RS_A,
    pin: [
      {
        key: 'uart',
        title: $localize`UART TX`,
        options: IO.roter(DeviceType.UART),
        group: ZUnoDeviceGroup.UART,
        busBars: [0, 1],
      },
      {
        key: 'RS-485',
        title: $localize`RS-485 A`,
        options: IO.roter(DeviceType.RS485),
        group: ZUnoDeviceGroup.RS,
        busBars: [2, 3, 4, 5, 6, 7],
      },
      {
        key: 'digital input 3',
        title: $localize`Digital input 0/3 V`,
        options: IO.digitalInput,
        busBars: [0],
      },
      {
        key: 'digital output',
        title: $localize`Digital output 0/3 V`,
        options: IO.digitalOutput,
        busBars: [0],
      },
    ],
  },
  {
    title: '8, RS-B',
    id: ZUnoShieldPin.RS_B,
    pin: [
      {
        key: 'uart',
        title: $localize`UART RX`,
        options: IO.roter(DeviceType.UART),
        group: ZUnoDeviceGroup.UART,
        busBars: [0, 1],
      },
      {
        key: 'RS-485',
        title: $localize`RS-485 B`,
        options: IO.roter(DeviceType.RS485),
        group: ZUnoDeviceGroup.RS,
        busBars: [2, 3, 4, 5, 6, 7],
      },
      {
        key: 'digital input 3',
        title: $localize`Digital input 0/3 V`,
        options: IO.digitalInput,
        busBars: [1],
      },
      {
        key: 'digital output',
        title: $localize`Digital output 0/3 V`,
        options: IO.digitalOutput,
        busBars: [1],
      },
    ],
  },
  {
    title: '12',
    id: ZUnoShieldPin.PIN_12,
    pin: [
      ...IO.temperatureHumidity,
      {
        key: 'digital input 3',
        title: $localize`Digital input 0/3 V`,
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
    id: ZUnoShieldPin.ONE_WIRE,
    pin: [
      ...IO.ds18b20,
      ...IO.temperatureHumidity,
      {
        key: 'digital input 3',
        title: $localize`Digital input 0/3 V`,
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
    id: ZUnoShieldPin.ADC3,
    pin: IO.adcConfig,
  },
  {
    title: 'ADC2',
    id: ZUnoShieldPin.ADC2,
    pin: IO.adcConfig,
  },
  {
    title: 'ADC1',
    id: ZUnoShieldPin.ADC1,
    pin: IO.adcConfig,
  },
  {
    title: 'ADC0',
    id: ZUnoShieldPin.ADC0,
    pin: IO.adcConfig,
  },
]
