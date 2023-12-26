import { PinConfig } from '@configurator/shared';
import { BaseDevice } from './base-device';
import { DeviceVariables } from './device.interface';

export class DHT extends BaseDevice {
  public override channels = 2;

  constructor(protected override readonly config: PinConfig) {
    super(config);
  }

  public override get includes(): string {
    return '#include "ZUNO_DHT.h"';
  }

  public override get channel(): string {
    return `  ZUNO_SENSOR_MULTILEVEL(ZUNO_SENSOR_MULTILEVEL_TYPE_TEMPERATURE, SENSOR_MULTILEVEL_SCALE_CELSIUS, SENSOR_MULTILEVEL_SIZE_TWO_BYTES, SENSOR_MULTILEVEL_PRECISION_ONE_DECIMAL, pin${this.config.id}DHTTemperatureState),
  ZUNO_SENSOR_MULTILEVEL(ZUNO_SENSOR_MULTILEVEL_TYPE_RELATIVE_HUMIDITY, SENSOR_MULTILEVEL_SCALE_PERCENTAGE_VALUE, SENSOR_MULTILEVEL_SIZE_TWO_BYTES, SENSOR_MULTILEVEL_PRECISION_ONE_DECIMAL, pin${this.config.id}DHTHumidityState)`;
  }

  public override loop(channel: number): string {
    return `  // DHT sensor (@pin${this.config.id}) read procedure
  int _pin${this.config.id}DHTTemperatureState = pin${
      this.config.id
    }DHT.readTemperatureC10();
  word _pin${this.config.id}DHTHumidityState = pin${
      this.config.id
    }DHT.readHumidityH10();
    
  if(abs(_pin${this.config.id}DHTTemperatureState-pin${
      this.config.id
    }DHTTemperatureState) > 2) {
    // the temperature has changed by at least 0.2*C
    pin${this.config.id}DHTTemperatureState = _pin${
      this.config.id
    }DHTTemperatureState;
    zunoSendReport(${channel});
  }
  
  if(abs(_pin${this.config.id}DHTHumidityState-pin${
      this.config.id
    }DHTHumidityState) > 10) {
    // the humidity has changed by at least 1%
    pin${this.config.id}DHTHumidityState = _pin${
      this.config.id
    }DHTHumidityState;
    zunoSendReport(${channel + 1});
  }`;
  }

  public override get note(): string {
    return `- Connect ${this.config.id} sensor.`;
  }

  public override get setup(): string {
    return `  pin${this.config.id}DHT.begin();`;
  }

  public override get vars(): string {
    return `DHT pin${this.config.id}DHT(${this.config.id}, ${this.name});
    
int pin${this.config.id}DHTTemperatureState;
word pin${this.config.id}DHTHumidityState;`;
  }

  public override get variables(): DeviceVariables[] {
    return [{
      name: `DHT Temperature #${this.config.id}`,
      code: `pin${this.config.id}DHTTemperatureState`,
    }, {
      name: `DHT Humidity ${this.config.id}`,
      code: `pin${this.config.id}DHTHumidityState`,
    }];
  }
}
