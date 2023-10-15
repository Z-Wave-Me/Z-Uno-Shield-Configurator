import { Device } from './device.interface';
import { PinConfig } from '../../../../../apps/configurator/src/app/services/store/pins-state.service';

export class DS18B20 implements Device {
  public channels: number;
  public value: number;

  constructor(private readonly config: PinConfig) {
    this.value = +(this.config.device?.id ?? 0);
    this.channels = this.value;
  }


  public get includes(): string {
    return '#include "ZUNO_DS18B20.h"'
  }

  public get channel(): string {
    return Array.from({ length: this.channels }).map(() => '  ZUNO_SENSOR_MULTILEVEL(ZUNO_SENSOR_MULTILEVEL_TYPE_TEMPERATURE, SENSOR_MULTILEVEL_SCALE_CELSIUS, SENSOR_MULTILEVEL_SIZE_TWO_BYTES, SENSOR_MULTILEVEL_PRECISION_TWO_DECIMALS, temperature)').join(',\n');
  }

  public loop(channel?: number): string {
    return `  // DS18B20 sensors (@pin${this.config.id}) poll
  for(int ds_sen_i = 0; ds_sen_i < number_of_sensors; ds_sen_i++){
    int current_temp = ds18b20.getTempC100(&addresses[ds_sen_i << 3]);
    if(abs(current_temp - temperature[ds_sen_i]) >= 10){ 
      // the temperature has changed by at least 0.1*C
      temperature[ds_sen_i] = current_temp;
      zunoSendReport(${channel} + ds_sen_i);
    }
  }`;
  }

  public get name(): string | undefined {
    return undefined;
  }

  public get note(): string {
    return '';
  }

  public get report(): string {
    return '';
  }

  public get setup(): string {
    return `  number_of_sensors = ds18b20.findAllSensors(addresses, ${this.value});`;
  }

  public get vars(): string {
    return `OneWire ow(${this.config.id});
DS18B20Sensor ds18b20(&ow);

byte addresses[8 * (${this.value + 1})]; // last one for search
byte number_of_sensors; // Number of sensors found (if less than ${this.value} connected)
int temperature[${this.value}];`;
  }

  public get xetter(): string {
    return '';
  }

  public get functions(): string {
    return '';
  }
}
