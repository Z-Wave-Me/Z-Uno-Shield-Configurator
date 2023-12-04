import { DeviceType } from './device.model';
import { VoltageOffset } from '@configurator/arduino-code-gen';
import { ZUnoShieldPin } from '../../../../../apps/configurator/src/app/components/z-uno-shield/z-uno-shield.model';

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
  remove?: boolean;
  group?: string;
  busBars?: number[];
};

export type PinConfig = {
  id: string;
  device?: Partial<DeviceConfig>;
  key?: string;
  offset?: VoltageOffset;
  group?: string;
  busBars?: number[];
};

export type AssociationConfig =  {
  id: string;
}
