import { DeviceType } from './device.model';

export interface PinConfiguratorInput {
  title: string;
  value: string | number;
  type?: DeviceType;
  withType?: boolean;
  additionally?: {
    title: string;
    value: string | number;
  }[];
}

export interface ChildPinConfigurator {
  list?: string,
  type?: string,
  additionally?: string
}
