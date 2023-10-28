import { DeviceType } from './device.model';
import { Grounding } from '@configurator/arduino-code-gen';

export interface PinConfiguratorInput {
  title: string;
  value: string | number;
  type?: DeviceType;
  withType?: boolean;
  additionally?: {
    title: string;
    value: string | number | Grounding;
  }[];
  group?: string;
  busBars?: number[];
}

export interface ChildPinConfigurator {
  list?: string,
  type?: string,
  additionally?: string
}
