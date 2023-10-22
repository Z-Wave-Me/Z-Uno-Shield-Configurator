import { PinConfig } from '@configurator/shared';
import { BaseDevice } from './base-device';


export class UART extends BaseDevice {
  public override channels = 0;
  public value: number;

  constructor(protected readonly arrayConfig: PinConfig[]) {
    super(arrayConfig[0]);
    this.value = +(this.arrayConfig[0]?.device?.id ?? 0)
  }
  public override get setup(): string {
    return `  Serial1.begin(${this.value});`;
  }

  public override get functions(): string {
    return `char readByteUART() {
  while(Serial1.available() <= 0) delay(1);
  return Serial1.read();
}

void writeUART(char b) {
  Serial1.write(b);
}`;
  }
}
