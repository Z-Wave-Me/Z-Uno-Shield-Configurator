import { PinConfig } from '@configurator/shared';
import { BaseDevice } from './base-device';


export class SwitchBinary extends BaseDevice {
  private static readonly nameMap: Record<string, string> = {
    switch: 'ZUNO_SWITCH_BINARY',
    doorLock: 'ZUNO_DOORLOCK',
    siren: 'ZUNO_SIREN',
    valve: 'ZUNO_FLOWSTOP',
  };
  public override channels = 1;

  constructor(protected override readonly config: PinConfig) {
    super(config);
  }

  public override get includes(): string | undefined {
    return undefined;
  }

  public override get note(): string {
    if (this.config.id.includes('pwm')) {
      return '- Make sure that output current do not exceed 5 A per channel or 15 A per all PWM1-4 pins';
    }

    return '';
  }

  public override get name(): string | undefined {
    const key = this.config.key;

    if(key) {
      return SwitchBinary.nameMap[key];
    }

    return undefined;
  }

  public override get channel(): string {
    return `  ${this.name}(pin${this.config.id}SwitchBinaryState, NULL)`;
  }

  public override loop(): string {
    const condition = this.config.device?.type === 'normal'
        ? 'HIGH : LOW'
        : 'LOW : HIGH';

    return `  // GPIOSwitchBinary@pin${this.config.id} process code
  digitalWrite(${this.config.id}, pin${this.config.id}SwitchBinaryState ? ${condition});`;
  }

  public override get setup(): string {
    return `  pinMode(${this.config.id}, OUTPUT);`;
  }

  public override get vars(): string {
    return `byte pin${this.config.id}SwitchBinaryState = 0;`;
  }
}
