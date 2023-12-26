import { Device, DeviceVariables } from './device.interface';
import { PinConfig } from '@configurator/shared';

export class BaseDevice implements Device {
  public channels = 1;

  constructor(protected readonly config: PinConfig) {
  }

  public get channel(): string {
    return '';
  }

  public get functions(): string {
    return '';
  }

  public get includes(): string | undefined {
    return undefined;
  }

  public loop(channel?: number): string {
    return '';
  }

  public get name(): string | undefined {
    return this.config.device?.id?.toString().toLocaleUpperCase() ?? '';
  }

  public get note(): string {
    return '';
  }

  public get report(): string {
    return '';
  }

  public get setup(): string {
    return '';
  }

  public get vars(): string {
    return '';
  }

  public get xetter(): string {
    return '';
  }

  public get v10Mode(): boolean  {
    return  false;
  }

  public get pwm(): string {
    return '';
  }

  public notes(): Record<number, string> {
    return {};
  }

  public get variables(): DeviceVariables[] {
    return [];
  }
}
