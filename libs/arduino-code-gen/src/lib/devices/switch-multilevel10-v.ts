import { Action, PinConfig } from '@configurator/shared';
import { BaseDevice } from './base-device';


export class SwitchMultilevel10V extends BaseDevice {
  constructor(protected override readonly config: PinConfig) {
    super(config);
  }

  public override get channel(): string {
    return `  ZUNO_SWITCH_MULTILEVEL(pin${this.config.id}SwitchMultilevelState, NULL)`;
  }

  public override get vars(): string {
    return `zunoChangeDefine(byte, pin${this.config.id}SwitchMultilevelState);`;
  }

  public override get v10Mode(): boolean {
    return true;
  }

  public override loop_pre(channel: number): string {
    return '';
  }

  public override loop_post(channel: number): string {
    return `  // 0-10V SwitchMultilevel@pin${this.config.id} process code
  if (zunoChanged(pin${this.config.id}SwitchMultilevelState)) {
    shield.write0_10V(${channel}, pin${this.config.id}SwitchMultilevelState);
    zunoChangeUpdate(pin${this.config.id}SwitchMultilevelState);
    zunoSendReport(${channel});
  }`;
  }

  public override get setup(): string {
    return `  zunoChangeInit(pin${this.config.id}SwitchMultilevelState, 0);`;
  }

  public override get variables(): Action[] {
    return [{
      parentId: `pin${this.config.id}SwitchMultilevelState`,
      template: `pin${this.config.id}SwitchMultilevelState = {0};`,
      title: `Switch Multilevel ${this.config.id}`,
      parameters: [],
    }];
  }
}
