import { Device } from './device.interface';
import { PinConfig } from '../../../../../apps/configurator/src/app/services/store/pins-state.service';

export class SwitchBinary implements Device {
  private static readonly nameMap: Record<string, string> = {
    switch: 'ZUNO_SWITCH_BINARY',
    doorlock: 'ZUNO_DOORLOCK',
    siren: 'ZUNO_SIREN',
    valve: 'ZUNO_FLOWSTOP',
  };
  public channels = 1;

  constructor(private readonly config: PinConfig) { }

  public get note(): string {
    if (this.config.id.includes('pwm')) {
      return '- Make sure that output current do not exceed 5 A per channel or 15 A per all PWM1-4 pins';
    }

    return '';
  }

  public get name(): string | undefined {
    const key = this.config.key;

    if(key) {
      return SwitchBinary.nameMap[key];
    }

    return undefined;
  }

  public get channel(): string {
    return `  ${this.name}(pin${this.config.id}SwitchBinaryState, NULL)`;
  }

  public loop(): string {
    const condition = this.config.device?.type === 'normal'
        ? 'HIGH : LOW'
        : 'LOW : HIGH';

    return `  // GPIOSwitchBinary@pin${this.config.id} process code
  digitalWrite(${this.config.id}, pin${this.config.id}SwitchBinaryState ? ${condition});`;
  }

  public get setup(): string {
    return `  pinMode(${this.config.id}, OUTPUT);`;
  }

  public get vars(): string {
    return `byte pin${this.config.id}SwitchBinaryState = 0;`;
  }

  public get xetter(): string {
    return '';
  }

  public get report(): string {
    return '';
  }
}
