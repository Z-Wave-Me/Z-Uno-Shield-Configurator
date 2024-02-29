import { Action, PinConfig } from '@configurator/shared';
import { BaseDevice } from './base-device';
import { ColorDevices } from '../device.model';

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

const isString = (input: unknown): input is string => typeof input === 'string';

const isColorDevices = (
  input: number | string | null | undefined,
): input is ColorDevices => Object.values(ColorDevices).includes(input as ColorDevices);


export class SwitchColor extends BaseDevice {
  public override channels = 1;
  private readonly flagMap: Record<ColorDevices, ColorFlag> = {
    [ColorDevices.Blue]: ColorFlag.Blue,
    [ColorDevices.Red]: ColorFlag.Red,
    [ColorDevices.Green]: ColorFlag.Green,
    [ColorDevices.White]: ColorFlag.White,
  };

  private readonly modeMap: Record<ColorDevices, ColorMode> = {
    [ColorDevices.Blue]: ColorMode.Blue,
    [ColorDevices.Red]: ColorMode.Red,
    [ColorDevices.Green]: ColorMode.Green,
    [ColorDevices.White]: ColorMode.White,
  };

  constructor(protected readonly arrayConfig: PinConfig[]) {
    super(arrayConfig[0]);
  }

  public override get channel(): string {
    const channels = this.arrayConfig
      .map((item) => item.device?.id)
      .filter(isColorDevices)
      .map((id: ColorDevices) => this.flagMap[id])
      .join(' | ');

    return `  ZUNO_SWITCH_COLOR(${channels}, pinsSwitchColorGetter, pinsSwitchColorSetter)`;
  }

  public override get note(): string {
    return '- Make sure that output current do not exceed 5 A per channel or 15 A per all PWM1-4 pins';
  }

  public override get vars(): string {
    return this.ids
      .map((id) => `zunoChangeDefine(byte, pin${id}SwitchColorState);`)
      .join('\n');
  }

  public override get xetter(): string {
    const list = this.arrayConfig.map(({ id, device }) => ({
      pinId: id,
      deviceId: device?.id,
    }));

    const modeList = list.map(({ pinId, deviceId }) => ({
      pinId,
      deviceMode: this.modeMap[deviceId as ColorDevices],
    }));

    const setters = modeList
      .map(
        ({ pinId, deviceMode }) => `    case ${deviceMode}:
      pin${pinId}SwitchColorState = value;
      break;`
      )
      .join('\n');

    const getters = modeList
      .map(
        ({ pinId, deviceMode }) => `    case ${deviceMode}:
      return pin${pinId}SwitchColorState;`
      )
      .join('\n');

    return `void pinsSwitchColorSetter(byte color, byte value) {
  switch(color){
${setters}
  }
}

byte pinsSwitchColorGetter(byte color) {
  switch(color){
${getters}
  }
  return 0;
}`;
  }

  public override loop_pre(channel: number): string {
    return '';
  }
  
  public override loop_post(channel: number): string {
    return `  // PWM SwitchColor@pin process code
  ` + this.arrayConfig
      .map(
        ({ id }) => `  shield.writePWMPercentage(PWM_CHANNEL(${id}), pin${id}SwitchColorState);`)
      .join('\n') + 
    `  if(` + this.arrayConfig
      .map(
        ({ id }) => `zunoChanged(pin${id}SwitchColorState)`)
      .join(' || ') + `) {
` + this.arrayConfig
      .map(
        ({ id }) => `zunoChangeUpdate(pin${id}SwitchColorState);`)
      .join('\n') + `  zunoSendReport(${channel});
  }`;
  }

  public override get setup(): string {
    return this.arrayConfig
      .map(
        ({ id }) => `  zunoChangeInit(pin${id}SwitchColorState, 0);`
      ).join('\n');
  }

  public override get pwm(): string {
    return this.ids.map((id) => `PWM_CHANNEL_MASK(${id})`).join(' | ');
  }

  private get ids(): string[] {
    return this.arrayConfig.map(({ id }) => id).filter(isString);
  }

  public override get variables(): Action[] {
    return this.ids
      .map((id) => ({
        parentId: `pin${id}SwitchColorState`,
        title: `Switch Color #${id}`,
        template: `pin${id}SwitchColorState = {0};`,
        parameters: [],
      }));
  }
}
