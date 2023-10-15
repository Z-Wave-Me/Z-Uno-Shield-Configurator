import { DeviceType } from './device.model';

export enum ConnectionMode {
  Normal = 'normal',
  Inverted = 'inverted',
}

export type DeviceConfig = {
  title: string;
  id: string | number;
  additionally: string | number | null | undefined;
  type: ConnectionMode | null;
  deviceType?: DeviceType;
  withGround?: number;
  lowerBound: number | null;
  upperBound: number | null;
  bindPin: string;
  remove?: boolean;
};
export type PinConfig = {
  id: string;
  device?: Partial<DeviceConfig>;
  key?: string;
  lockIds?: string[];
};
