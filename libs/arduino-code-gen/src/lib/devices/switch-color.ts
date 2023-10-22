import { PinConfig } from '@configurator/shared';
import { BaseDevice } from './base-device';

enum ColorFlag {
  White = 'SWITCH_COLOR_FLAGS_WARM_WHITE',
  Red = 'SWITCH_COLOR_FLAGS_RED',
  Green = 'SWITCH_COLOR_FLAGS_GREEN',
  Blue = 'SWITCH_COLOR_FLAGS_BLUE',
}

enum ColorMode {
  White = 'SWITCH_COLOR_COMPONENT_WARM_WHITE',
  Red = 'SWITCH_COLOR_COMPONENT_RED',
  Green = 'SWITCH_COLOR_COMPONENT_GREEN',
  Blue = 'SWITCH_COLOR_COMPONENT_BLUE',
}

export class SwitchColor extends BaseDevice {
  public override channels = 1;

  constructor(protected override readonly config: PinConfig) {
    super(config);
    console.warn(config);
  }

  public override get channel(): string {
    // TODO тут тоже узнать
    return '  ZUNO_SWITCH_COLOR(PPP2PPP, pinsSwitchColorGetter, pinsSwitchColorSetter)';
  }

  public override loop(): string {
    return `  // PWM SwitchColor@pin${this.config.id}process code
  analogWriteResolution(8); analogWrite(${this.config.id}, pin${this.config.id}SwitchMultilevelState);`;
  }

  public override get note(): string {
    return '- Make sure that output current do not exceed 5 A per channel or 15 A per all PWM1-4 pins';
  }

  public override get setup(): string {
    return `  pinMode(${this.config.id}, OUTPUT);`;
  }

  public override get vars(): string {
    return `byte pin${this.config.id}SwitchMultilevelState = 0;`;
  }

  public override get xetter(): string {
    // TODO что тут с цветами
    return `void pinsSwitchColorSetter(byte color, byte value) {
PPP3PPP
}

byte pinsSwitchColorGetter(byte color) {
PPP4PPP
}`;
  }
}
