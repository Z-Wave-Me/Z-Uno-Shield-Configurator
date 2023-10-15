import { Device } from './device.interface';
import { PinConfig } from '@configurator/shared';


export class SwitchMultilevel implements Device {
  public channels = 1;

  constructor(private readonly config: PinConfig) { }

  public get includes(): string | undefined {
    return undefined;
  }

  public get channel(): string {
    return `  ZUNO_SWITCH_MULTILEVEL(pin${this.config.id}SwitchMultilevelState, NULL)`;
  }

  public loop(): string {
    return `  // PWM SwitchMultilevel@pin${this.config.id} process code
  shield.writePWMPercentage(PPP3PPP, pin${this.config.id}SwitchMultilevelState);`;
  }

  public get name(): string | undefined {
    return undefined;
  }

  public get note(): string {
    // TODO уточчить SwitchMultilevelPWM0
    return '- Make sure that output current do not exceed 5 A per channel or 15 A per all PWM1-4 pins';
  }

  public get report(): string {
    return '';
  }

  public get setup(): string {
    return '';
  }

  public get vars(): string {
    return `byte pin${this.config.id}SwitchMultilevelState = 0;`;
  }

  public get xetter(): string {
    return '';
  }

  public get functions(): string {
    return '';
  }

  public pwm_map(): string {
    // TODO Узнать что это; в основном коде
    // params[3] = (pin - 13);
    // params[2] = ''+1 << (params[3]);
    return '';
  }
}
