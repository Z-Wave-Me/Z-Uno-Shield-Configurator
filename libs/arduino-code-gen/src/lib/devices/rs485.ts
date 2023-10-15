import { Device } from './device.interface';
import { PinConfig } from '../../../../../apps/configurator/src/app/services/store/pins-state.service';

export class RS485 implements Device {
  public channels = 0;

  constructor(private readonly config: PinConfig) {}

  public get channel(): string {
    return '';
  }

  public get functions(): string {
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
    return `  Serial1.begin(${this.config.device?.id});
  pinMode(2, OUTPUT);
  digitalWrite(2, LOW);`;
  }

  public get vars(): string {
    return '';
  }

  public get xetter(): string {
    return '';
  }
}
