import { Action, PinConfig } from '@configurator/shared';
import { BaseDevice } from './base-device';
import { Grounding } from '../device.model';


export class SensorBinary extends BaseDevice {
  private static readonly nameMap: Record<string, string> = {
    'general': 'ZUNO_SENSOR_BINARY_TYPE_GENERAL_PURPOSE',
    'smoke': 'ZUNO_SENSOR_BINARY_TYPE_SMOKE',
    'CO': 'ZUNO_SENSOR_BINARY_TYPE_CO',
    'CO2': 'ZUNO_SENSOR_BINARY_TYPE_CO2',
    'heat': 'ZUNO_SENSOR_BINARY_TYPE_HEAT',
    'leakage': 'ZUNO_SENSOR_BINARY_TYPE_WATER',
    'freeze': 'ZUNO_SENSOR_BINARY_TYPE_FREEZE',
    'tamper': 'ZUNO_SENSOR_BINARY_TYPE_TAMPER',
    'door': 'ZUNO_SENSOR_BINARY_TYPE_DOOR_WINDOW',
    'tilt': 'ZUNO_SENSOR_BINARY_TYPE_TILT',
    'motion': 'ZUNO_SENSOR_BINARY_TYPE_MOTION',
    'glassbr': 'ZUNO_SENSOR_BINARY_TYPE_GLASSBREAK',
  }
  public override channels = 1;

  constructor(protected override readonly config: PinConfig) {
    super(config);
  }

  public override get channel(): string {

    return `  ZUNO_SENSOR_BINARY(${this.name}, pin${this.config.id}SensorBinaryState)`;
  }

  public override loop_pre(channel: number): string {
    const inverted = this.config.device?.type === 'inverted' ? '': '!';

    return `  // GPIO SensorBinary@pin${this.config.id} process code
  pin${this.config.id}SensorBinaryState = ${inverted}digitalRead(${this.config.id});`;
  }

  public override loop_post(channel: number): string {
    const inverted = this.config.device?.type === 'inverted' ? '': '!';

    return `  // GPIO SensorBinary@pin${this.config.id} process code
  if (zunoChanged(pin${this.config.id}SensorBinaryState)) {
    zunoChangeUpdate(pin${this.config.id}SensorBinaryState);
    zunoSendReport(${channel});
  }`;
  }

  public override get name(): string | undefined {
    return SensorBinary.nameMap[this.config.device?.id ?? -1];
  }

  public override get note(): string {
    return this.isPullUp ? '- Make sure that input is always pulled to high or low level.' : '';
  }

  public override get setup(): string {
    const inverted = this.config.device?.type === 'inverted' ? '!': '';

    return `  pinMode(${this.config.id}, INPUT_PULLUP);
  zunoChangeInit(pin${this.config.id}SensorBinaryState, ${inverted}!digitalRead(${this.config.id}));`;
  }

  public override get vars(): string {
    return `zunoChangeDefine(byte, pin${this.config.id}SensorBinaryState);`;
  }

  private get isPullUp(): boolean {
    return this.config.device?.additionally === Grounding.Free;
  }

  public override get variables(): Action[] {
    return [{
      parentId: `pin${this.config.id}SensorBinaryState`,
      template: `pin${this.config.id}SensorBinaryState = {0}`,
      title: `Sensor binary ${this.config.id}`,
      parameters: [],
    }];
  }
}

