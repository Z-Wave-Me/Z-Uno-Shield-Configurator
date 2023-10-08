import { Device } from './device.interface';
import { PinConfig } from '../../../../../apps/configurator/src/app/services/store/pins-state.service';

export class Thermostat implements Device {
  private readonly step = 10; // 1 deg C

  constructor(private readonly config: PinConfig) { }

  public get channel(): string {
    const flag = this.config.device?.id === 'heatingThermostat' ? 'HEAT' : 'COOL'

    return `  ZUNO_THERMOSTAT(THERMOSTAT_FLAGS_OFF | THERMOSTAT_FLAGS_${flag}, THERMOSTAT_UNITS_CELSIUS, THERMOSTAT_RANGE_POS, 4, pinXXXThermostatModeGetter, pinXXXThermostatModeSetter, pinXXXThermostatTemperatureGetter, pinXXXThermostatTemperatureSetter)`;
  }

  public get loop(): string {
    const external = this.config.device?.additionally?.toString().startsWith('Z-wave')
        ? ''
        // TODO Спросить что тут должно быть
        : '\n    pinXXXThermostatTemperatureCurrent = temperature[' + (1 - 1) + ']/10;';

    return `  // Thermostat@pinXXX process code
  if (pinXXXThermostatModeState) {${external}
    if (pinXXXThermostatTemperatureState < pinXXXThermostatTemperatureCurrent - ${this.step}) {
      digitalWrite(XXX, ${this.getMode()});
    }
    if (pinXXXThermostatTemperatureState > pinXXXThermostatTemperatureCurrent + ${this.step}) {
      digitalWrite(XXX, ${this.getMode(false)});
    }
  }`;
  }

  public get name(): string | undefined {
    return undefined;
  }

  public get note(): string {
    // You need to set up DS18B20 channel with at least ' + ds18b20Num + ' sensor' + (ds18b20Num > 1 ? 's' : '') + '.'
    // TODO узнать что в каком случае выводить?
    return 'Put Z-Uno in the Life Line association group of a temperature sensor. Make sure both devices share same security scheme';

  }

  public get setup(): string {
    return '  pinMode(XXX, OUTPUT);';
  }

  public get vars(): string {
    return `byte pinXXXThermostatModeState = 0;
int pinXXXThermostatTemperatureState = 0;
int pinXXXThermostatTemperatureCurrent = 0;`;
  }

  public get xetter(): string {
    return `void pinXXXThermostatModeSetter(byte value) {
  pinXXXThermostatModeState = value;
}

byte pinXXXThermostatModeGetter() {
  return pinXXXThermostatModeState;
}

void pinXXXThermostatTemperatureSetter(byte mode, signed int value) {
  pinXXXThermostatTemperatureState = value;
}

signed int pinXXXThermostatTemperatureGetter(byte mode) {
  return pinXXXThermostatTemperatureState;
}`;
  }

  public get report(): string {
    return `  // External temperature sensor for thermostat @pinXXX processing
  if ( REPORT_SENSOR_MULTILEVEL_TYPE(report) == ZUNO_SENSOR_MULTILEVEL_TYPE_TEMPERATURE) {
    int temp = int(REPORT_SENSOR_MULTILEVEL_VALUE(report) * 10);
    
    if (REPORT_SENSOR_MULTILEVEL_SCALE(report) != SENSOR_MULTILEVEL_SCALE_CELSIUS) {
      // Conversion from degrees Fahrenheit to degrees Celsius
      temp = (temp - 32) * 5 / 9;
    }
    
    pinXXXThermostatTemperatureCurrent = temp;
  }`;
  }

  private getMode(invert = true): string {
    const condition = (this.config.device?.type === 'normal') === (this.config.device?.id === 'heatingThermostat');

    return invert === condition ? 'HIGH' : 'LOW';
  }
}
