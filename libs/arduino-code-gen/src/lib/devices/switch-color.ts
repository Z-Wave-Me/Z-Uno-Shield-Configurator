import { Device } from './device.interface';
import { PinConfig } from '@configurator/shared';
import { BaseDevice } from './base-device';


export class SwitchColor extends BaseDevice {
  public channels = 1;

  constructor(protected readonly config: PinConfig) {
    super(config);
  }

  public get channel(): string {
    // TODO тут тоже узнать
    return '  ZUNO_SWITCH_COLOR(PPP2PPP, pinsSwitchColorGetter, pinsSwitchColorSetter)';
  }

  public loop(): string {
    return `  // PWM SwitchColor@pin${this.config.id}process code
  analogWriteResolution(8); analogWrite(${this.config.id}, pin${this.config.id}SwitchMultilevelState);`;
  }

  public get note(): string {
    return '- Make sure that output current do not exceed 5 A per channel or 15 A per all PWM1-4 pins';
  }

  public get setup(): string {
    return `  pinMode(${this.config.id}, OUTPUT);`;
  }

  public get vars(): string {
    return `byte pin${this.config.id}SwitchMultilevelState = 0;`;
  }

  public get xetter(): string {
    // TODO что тут с цветами
    return `void pinsSwitchColorSetter(byte color, byte value) {
PPP3PPP
}

byte pinsSwitchColorGetter(byte color) {
PPP4PPP
}`;
  }
}
