import { PinConfig } from '@configurator/shared';
import { BaseDevice } from './base-device';


export class RS485 extends BaseDevice{
  public override channels = 0;

  constructor(protected readonly arrayConfig: PinConfig[]) {
    super(arrayConfig[0]);
  }

  public override get functions(): string {
    return `char readByteRS485() {
  while(Serial1.available() <= 0) delay(1);
  return Serial1.read();
}

void writeRS485(char b) {
  digitalWrite(2, HIGH);
  delay(5);
  Serial1.write(b);
  delay(5);
  digitalWrite(2, LOW);
}`;
  }

  public override get setup(): string {
    return `  Serial1.begin(${this.config.device?.id});
  pinMode(2, OUTPUT);
  digitalWrite(2, LOW);`;
  }
}
