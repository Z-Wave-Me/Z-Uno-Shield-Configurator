import { PinConfig } from '@configurator/shared';
import { BaseDevice } from './base-device';


export class SwitchMultilevel extends BaseDevice {
  public override channels = 0;

  constructor(protected override readonly config: PinConfig) {
    super(config);
  }

  public override get channel(): string {
    return `  ZUNO_SWITCH_MULTILEVEL(pin${this.config.id}SwitchMultilevelState, NULL)`;
  }

  public override get vars(): string {
    return `byte pin${this.config.id}SwitchMultilevelState = 0, _pin${this.config.id}SwitchMultilevelState = 1;;`;
  }

  public override get v10Mode(): boolean {
    return true;
  }

  public override loop(): string {
    return `  // 0-10V SwitchMultilevel@pin${this.config.id} process code
  if (pin${this.config.id}SwitchMultilevelState != _pin${this.config.id}SwitchMultilevelState) {
    _pin${this.config.id}SwitchMultilevelState = pin${this.config.id}SwitchMultilevelState;
    shield.write0_10V(${this.channels}, pin${this.config.id}SwitchMultilevelState);
  }`;
  }

  public override get pwm(): string {
    return `  shield.initPWM(1 << (${this.config.id} - 13));\n`
  }
}
