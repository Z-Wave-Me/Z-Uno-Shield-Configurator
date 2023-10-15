import { Device } from './device.interface';
import { PinConfig } from '@configurator/shared';


export class UART implements Device{
  public channels = 0;
  public value: number;

  constructor(private readonly config: PinConfig) {
    this.value = +(this.config.device?.id ?? 0)
  }

  public get channel(): string {
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
    return `  Serial1.begin(${this.value});`;
  }

  public get vars(): string {
    return '';
  }

  public get xetter(): string {
    return '';
  }

  public get functions(): string {
    return `char readByteUART() {
  while(Serial1.available() <= 0) delay(1);
  return Serial1.read();
}

void writeUART(char b) {
  Serial1.write(b);
}`;
  }
}
