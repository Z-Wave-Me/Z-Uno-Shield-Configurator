import { PinConfig } from '@configurator/shared';
import { BaseDevice } from './base-device';
import { ColorDevices, notNull } from '@configurator/arduino-code-gen';

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
    console.warn(arrayConfig);
  }

  public override get channel(): string {
    const channels = this.ids.filter(isColorDevices)
      .map((id: ColorDevices) => this.flagMap[id])
      .join(' | ');

    return `  ZUNO_SWITCH_COLOR(${channels}, pinsSwitchColorGetter, pinsSwitchColorSetter)`;
  }

  public override get note(): string {
    return '- Make sure that output current do not exceed 5 A per channel or 15 A per all PWM1-4 pins';
  }

  public override get setup(): string {
    return this.arrayConfig
      .map(({ id }) => `  pinMode(${id}, OUTPUT);`)
      .join('\n');
  }

  public override get vars(): string {
    return this.ids
      .map((id) => `byte pin${id}SwitchMultilevelState = 0;`)
      .join('\n');
  }

  public override get xetter(): string {
    const modeList = this.arrayConfig
      .map(({ id, device }) => ({
        pinId: id,
        deviceId: device?.id,
      }))
      .map(({ pinId, deviceId }) => ({
        pinId,
        deviceMode: this.modeMap[deviceId as ColorDevices],
      }));
    const setters = modeList.map(({pinId, deviceMode}) => `  if (color == ${deviceMode}) pin${pinId}SwitchMultilevelState = value;`).join('\n');

    const getters = modeList.map(({pinId, deviceMode}) =>`  if (color == ${deviceMode}) return pin${pinId}SwitchMultilevelState;`).join('\n');

    return `void pinsSwitchColorSetter(byte color, byte value) {
${setters}
}

byte pinsSwitchColorGetter(byte color) {
${getters}
}`;
  }

  public override loop(): string {
    return this.arrayConfig.map(({ id }) => `  // PWM SwitchColor@pin${id}process code
  analogWriteResolution(8); analogWrite(${id}, pin${id}SwitchMultilevelState);`).join('\n')
  }

  private get ids(): string[] {
    return this.arrayConfig.map(({ device}) => device?.id).filter(isString);
  }
}
