import { Device } from './device.interface';
import { PinConfig } from '../../../../../apps/configurator/src/app/services/store/pins-state.service';

export class SensorBinary implements Device {
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
  public channels = 1;

  constructor(private readonly config: PinConfig) { }

  public get channel(): string {

    return `  ZUNO_SENSOR_BINARY(${this.name}, pin${this.config.id}SensorBinaryState)`;
  }

  public get loop(): string {
    const inverted = this.config.device?.type === 'inverted' ? '!': '';

    return `  // GPIO SensorBinary@pin${this.config.id} process code
  byte _pin${this.config.id}SensorBinaryState = ${inverted}digitalRead(${this.config.id});
  if (pin${this.config.id}SensorBinaryState != _pin${this.config.id}SensorBinaryState) {
    pin${this.config.id}SensorBinaryState = _pin${this.config.id}SensorBinaryState;
    zunoSendReport(${this.channels});
  }`;
  }

  public get name(): string | undefined {
    return SensorBinary.nameMap[this.config.device?.id ?? -1];
  }

  public get note(): string {
    return 'PPP5PPP';
  }

  public get report(): string {
    return '';
  }

  public get setup(): string {
    // TODO что за 'pullup'
    const inverted = this.config.device?.type === 'inverted' ? '!': '';


    return `  pinMode(${this.config.id}, PPP4PPP);
  pin${this.config.id}SensorBinaryState = ${inverted}!digitalRead(${this.config.id});`;
  }

  public get vars(): string {
    return 'byte pin${this.config.id}SensorBinaryState;';
  }

  public get xetter(): string {
    return '';
  }

}
