import { PinConfig } from '@configurator/shared';
import { BaseDevice } from './base-device';


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

  public override loop(channel: number): string {
    const inverted = this.config.device?.type === 'inverted' ? '!': '';

    return `  // GPIO SensorBinary@pin${this.config.id} process code
  byte _pin${this.config.id}SensorBinaryState = ${inverted}digitalRead(${this.config.id});
  if (pin${this.config.id}SensorBinaryState != _pin${this.config.id}SensorBinaryState) {
    pin${this.config.id}SensorBinaryState = _pin${this.config.id}SensorBinaryState;
    zunoSendReport(${channel});
  }`;
  }

  public override get name(): string | undefined {
    return SensorBinary.nameMap[this.config.device?.id ?? -1];
  }

  public override get note(): string {
    return 'PPP5PPP';
  }

  public override get setup(): string {
    // TODO что за 'pullup'
    const inverted = this.config.device?.type === 'inverted' ? '!': '';

    return `  pinMode(${this.config.id}, PPP4PPP);
  pin${this.config.id}SensorBinaryState = ${inverted}!digitalRead(${this.config.id});`;
  }

  public override get vars(): string {
    return 'byte pin${this.config.id}SensorBinaryState;';
  }
}
