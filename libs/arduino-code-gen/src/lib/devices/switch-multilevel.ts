import { PinConfig } from '@configurator/shared';
import { BaseDevice } from './base-device';


export class SwitchMultilevel extends BaseDevice {
  public override channels = 1;

  constructor(protected override readonly config: PinConfig) {
    super(config);
  }

  public override get channel(): string {
    return `  ZUNO_SWITCH_MULTILEVEL(pin${this.config.id}SwitchMultilevelState, NULL)`;
  }

  public override loop(): string {
    return `  // PWM SwitchMultilevel@pin${this.config.id} process code
  shield.writePWMPercentage(PPP3PPP, pin${this.config.id}SwitchMultilevelState);`;
  }

  public override get note(): string {
    // TODO уточчить SwitchMultilevelPWM0
    return '- Make sure that output current do not exceed 5 A per channel or 15 A per all PWM1-4 pins';
  }

  public override get vars(): string {
    return `byte pin${this.config.id}SwitchMultilevelState = 0;`;
  }

  public pwm_map(): string {
    // TODO Узнать что это; в основном коде
    // params[3] = (pin - 13);
    // params[2] = ''+1 << (params[3]);
    return '';
  }
}
