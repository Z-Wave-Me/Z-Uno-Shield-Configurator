import { PinConfiguratorInput } from '@configurator/shared';

export enum ZUnoShieldPin {
  PWM1 = 'PWM1',
  PWM2 = 'PWM2',
  PWM3 = 'PWM3',
  PWM4 = 'PWM4',
  V10_1 = '0',
  V10_2 = '1',
  V10_3 = '2',
  V10_4 = '3',
  RS_A = '7',
  RS_B = '8',
  PIN_12 = '12',
  ONE_WIRE = '11',
  ADC0 = 'A0',
  ADC1 = 'A1',
  ADC2 = 'A2',
  ADC3 = 'A3',
}

export enum ZUnoDeviceGroup {
  Color = 'color',
  RS = '[linked] rs',
  UART = '[linked] uart',
}

export interface Pin {
  id: string;
  title: string;
  pin: {
    withGround?: number;
    key: string;
    title: string;
    options: PinConfiguratorInput[];
    group?: string;
    busBars?: number[];
  }[];
}
