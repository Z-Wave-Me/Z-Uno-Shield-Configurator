import { PinConfiguratorInput } from '@configurator/shared';

export enum ZUnoShieldPin {
  PWM1 = '__c_code_here_1__',
  PWM2 = '__c_code_here_2__',
  PWM3 = '__c_code_here_3__',
  PWM4 = '__c_code_here_4__',
  V10_1 = '__c_code_here_5__',
  V10_2 = '__c_code_here_6__',
  V10_3 = '__c_code_here_7__',
  V10_4 = '__c_code_here_8__',
  RS_A = '__c_code_here_9__',
  RS_B = '__c_code_here_10__',
  PIN_12 = '__c_code_here_11__',
  ONE_WIRE = '__c_code_here_12__',
  ADC0 = '__c_code_here_13__',
  ADC1 = '__c_code_here_14__',
  ADC2 = '__c_code_here_15__',
  ADC3 = '__c_code_here_16__',
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
  }[];
}
