import { Device } from './device.interface';

export class RS485 implements Device {
  public channels: number = 0;

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
    return undefined;
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
}
