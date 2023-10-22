import { DeviceType } from './device.model';
import { Grounding } from '@configurator/arduino-code-gen';

export interface PinConfiguratorInput {
  title: string;
  value: string | number;
  type?: DeviceType;
  withType?: boolean;
  bindPin?: string;
  additionally?: {
    title: string;
    value: string | number | Grounding;
  }[];
}

export interface ChildPinConfigurator {
  list?: string,
  type?: string,
  additionally?: string
}
