import { PinConfig } from '@configurator/shared';
import { BaseDevice } from './base-device';


export class DS18B20 extends BaseDevice {
  public override channels: number;
  public value: number;

  constructor(protected override readonly config: PinConfig) {
    super(config);
    this.value = +(this.config.device?.id ?? 0);
    this.channels = this.value;
  }

  public override get includes(): string {
    return '#include "ZUNO_DS18B20.h"'
  }

  public override get channel(): string {
    return Array.from({ length: this.channels }).map(() => '  ZUNO_SENSOR_MULTILEVEL(ZUNO_SENSOR_MULTILEVEL_TYPE_TEMPERATURE, SENSOR_MULTILEVEL_SCALE_CELSIUS, SENSOR_MULTILEVEL_SIZE_TWO_BYTES, SENSOR_MULTILEVEL_PRECISION_TWO_DECIMALS, temperature)').join(',\n');
  }

  public override loop_pre(channel?: number): string {
    return `  // DS18B20 sensors (@pin${this.config.id}) poll
  for(int ds_sen_i = 0; ds_sen_i < number_of_sensors; ds_sen_i++) {
    temperature[ds_sen_i] = ds18b20.getTempC100(&addresses[ds_sen_i << 3]);
  }`;
  }

  public override loop_post(channel?: number): string {
    return `  // DS18B20 sensors (@pin${this.config.id}) poll
  for(int ds_sen_i = 0; ds_sen_i < number_of_sensors; ds_sen_i++) {
    if (zunoChangedBy(temperature[ds_sen_i], 10)) { 
      // the temperature has changed by at least 0.1*C
      zunoChangeUpdate(temperature[ds_sen_i]);
      zunoSendReport(${channel} + ds_sen_i);
    }
  }`;
  }

  public override get setup(): string {
    return `  number_of_sensors = ds18b20.findAllSensors(addresses, ${this.value});
  for(int ds_sen_i = 0; ds_sen_i < number_of_sensors; ds_sen_i++) {
    zunoChangeInit(temperature[ds_sen_i], ds18b20.getTempC100(&addresses[ds_sen_i << 3]));
  }`;
  }

  public override get vars(): string {
    return `OneWire ow(${this.config.id});
DS18B20Sensor ds18b20(&ow);

byte addresses[8 * (${this.value + 1})]; // last one for search
byte number_of_sensors; // Number of sensors found (if less than ${this.value} connected)
int zunoChangeDefine(temperature[${this.value}]);`;
  }
}
