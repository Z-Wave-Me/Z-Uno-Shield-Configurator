import { Device } from './device.interface';
import { PinConfig } from '../../../../../apps/configurator/src/app/services/store/pins-state.service';

export class DHT implements Device {
  public channels = 2;

  constructor(private readonly config: PinConfig) {}

  public get includes(): string {
    return '#include "ZUNO_DHT.h"'
  }

  public get channel(): string {
    return `  ZUNO_SENSOR_MULTILEVEL(ZUNO_SENSOR_MULTILEVEL_TYPE_TEMPERATURE, SENSOR_MULTILEVEL_SCALE_CELSIUS, SENSOR_MULTILEVEL_SIZE_TWO_BYTES, SENSOR_MULTILEVEL_PRECISION_ONE_DECIMAL, pin${this.config.id}DHTTemperatureState),
  ZUNO_SENSOR_MULTILEVEL(ZUNO_SENSOR_MULTILEVEL_TYPE_RELATIVE_HUMIDITY, SENSOR_MULTILEVEL_SCALE_PERCENTAGE_VALUE, SENSOR_MULTILEVEL_SIZE_TWO_BYTES, SENSOR_MULTILEVEL_PRECISION_ONE_DECIMAL, pin${this.config.id}DHTHumidityState)`;
  }

  public loop(channel: number): string {
    return `  // DHT sensor (@pin${this.config.id}) read procedure
  int _pin${this.config.id}DHTTemperatureState = pin${this.config.id}DHT.readTemperatureC10();
  word _pin${this.config.id}DHTHumidityState = pin${this.config.id}DHT.readHumidityH10();
  if(abs(_pin${this.config.id}DHTTemperatureState-pin${this.config.id}DHTTemperatureState) > 2) {
    // the temperature has changed by at least 0.2*C
    pin${this.config.id}DHTTemperatureState = _pin${this.config.id}DHTTemperatureState;
    zunoSendReport(${channel});
  }
  if(abs(_pin${this.config.id}DHTHumidityState-pin${this.config.id}DHTHumidityState) > 10) {
    // the humidity has changed by at least 1%
    pin${this.config.id}DHTHumidityState = _pin${this.config.id}DHTHumidityState;
    zunoSendReport(${channel + 1});
  }`;
  }

  public get name(): string | undefined {
    return undefined;
  }

  public get note(): string {
    return `- Connect ${this.config.id} sensor.`;
  }

  public get report(): string {
    return '';
  }

  public get setup(): string {
    return `  pin${this.config.id}DHT.begin();`;
  }

  public get vars(): string {
    return `DHT pin${this.config.id}DHT(${this.config.id}, PPP1PPP);
    
int pin${this.config.id}DHTTemperatureState;
word pin${this.config.id}DHTHumidityState;`;
  }

  public get xetter(): string {
    return '';
  }

  public get functions(): string {
    return '';
  }
}
