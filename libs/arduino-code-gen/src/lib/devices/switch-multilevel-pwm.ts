import { Action, PinConfig } from '@configurator/shared';
import { BaseDevice } from './base-device';


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
  shield.writePWMPercentage(PWM_CHANNEL(${this.config.id}), pin${this.config.id}SwitchMultilevelState);`;
  }

  public override get pwm(): string {
    return `PWM_CHANNEL_MASK(${this.config.id})`;
  }

  public override get variables(): Action[] {
    return [{
      parentId: `pin${this.config.id}SwitchMultilevelState`,
      template: `pin${this.config.id}SwitchMultilevelState = {0};`,
      title: `Switch Multilevel #${this.config.id}`,
      parameters: [],
    }];
  }
}
