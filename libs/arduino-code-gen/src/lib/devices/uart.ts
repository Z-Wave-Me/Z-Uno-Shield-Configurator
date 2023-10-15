import { PinConfig } from '@configurator/shared';
import { BaseDevice } from './base-device';


export class UART extends BaseDevice {
  public channels = 0;
  public value: number;

  constructor(protected readonly config: PinConfig) {
    super(config);
    this.value = +(this.config.device?.id ?? 0)
  }

  public get setup(): string {
    return `  Serial1.begin(${this.value});`;
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
