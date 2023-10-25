import { PinConfig } from '@configurator/shared';
import { BaseDevice } from './base-device';
import { ZUnoShieldPin } from '../../../../../apps/configurator/src/app/components/z-uno-shield/z-uno-shield.model';


export class SwitchMultilevelPwm extends BaseDevice {
  constructor(protected override readonly config: PinConfig) {
    super(config);
  }

  public override get channel(): string {
    return `  ZUNO_SWITCH_MULTILEVEL(pin${this.config.id}SwitchMultilevelState, NULL)`;
  }

  public override get vars(): string {
    return `byte pin${this.config.id}SwitchMultilevelState = 0;`;
  }

  public override loop(): string {
    return `  // PWM SwitchMultilevel@pin${this.config.id} process code
  shield.writePWMPercentage(${this.config.id} - ${ZUnoShieldPin.PWM1}, pin${this.config.id}SwitchMultilevelState);}`;
  }
}
