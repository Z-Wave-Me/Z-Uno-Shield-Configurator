import { Action, PinConfig } from '@configurator/shared';
import { BaseDevice } from './base-device';


export class Thermostat extends BaseDevice {
  private readonly step = 10; // 1 deg C

  public override channels = 1;

  constructor(protected override readonly config: PinConfig) {
    super(config);
  }

  public override get channel(): string {
    const flag = this.config.device?.id === 'heatingThermostat' ? 'HEAT' : 'COOL'

    return `  ZUNO_THERMOSTAT(THERMOSTAT_FLAGS_OFF | THERMOSTAT_FLAGS_${flag}, THERMOSTAT_UNITS_CELSIUS, THERMOSTAT_RANGE_POS, 4, pin${this.config.id}ThermostatModeGetter, pin${this.config.id}ThermostatModeSetter, pin${this.config.id}ThermostatTemperatureGetter, pin${this.config.id}ThermostatTemperatureSetter)`;
  }

  public override loop_pre(channel: number): string {
    if (this.config.device?.additionally?.toString().startsWith('Z-Wave')) {
      return '';
    } else {
      return `  // Thermostat@pin${this.config.id} process code
  pin${this.config.id}ThermostatTemperatureCurrent = temperature[` + (1 - 1) + `]/10;`;
    }
  }

  public override loop_post(channel: number): string {
    return `  // Thermostat@pin${this.config.id} process code
  if (zunoChanged(pin${this.config.id}ThermostatModeState) || zunoChanged(pin${this.config.id}ThermostatTemperatureState)) {
    zunoChangeUpdate(pin${this.config.id}ThermostatModeState);
    zunoChangeUpdate(pin${this.config.id}ThermostatTemperatureState);
    zunoSendReport(${channel});
  }
  if (pin${this.config.id}ThermostatModeState) {
    if (pin${this.config.id}ThermostatTemperatureState < pin${this.config.id}ThermostatTemperatureCurrent - ${this.step}) {
      digitalWrite(${this.config.id}, ${this.getMode()});
    }
    if (pin${this.config.id}ThermostatTemperatureState > pin${this.config.id}ThermostatTemperatureCurrent + ${this.step}) {
      digitalWrite(${this.config.id}, ${this.getMode(false)});
    }
  }`;
  }

  public override get note(): string {
    // You need to set up DS18B20 channel with at least ' + ds18b20Num + ' sensor' + (ds18b20Num > 1 ? 's' : '') + '.'
    // TODO узнать что в каком случае выводить?
    return 'Put Z-Uno in the Life Line association group of a temperature sensor. Make sure both devices share same security scheme';

  }

  public override get setup(): string {
    return `  pinMode(${this.config.id}, OUTPUT);
  zunoChangeInit(pin${this.config.id}ThermostatModeState, 0);
  zunoChangeInit(pin${this.config.id}ThermostatTemperatureState, 0);`;
  }

  public override get vars(): string {
    return `zunoChangeDefine(byte, pin${this.config.id}ThermostatModeState);
zunoChangeDefine(int, pin${this.config.id}ThermostatTemperatureState);
int pin${this.config.id}ThermostatTemperatureCurrent = 0;`;
  }

  public override get xetter(): string {
    return `void pin${this.config.id}ThermostatModeSetter(byte value) {
  pin${this.config.id}ThermostatModeState = value;
}

byte pin${this.config.id}ThermostatModeGetter() {
  return pin${this.config.id}ThermostatModeState;
}

void pin${this.config.id}ThermostatTemperatureSetter(byte mode, signed int value) {
  pin${this.config.id}ThermostatTemperatureState = value;
}

signed int pin${this.config.id}ThermostatTemperatureGetter(byte mode) {
  return pin${this.config.id}ThermostatTemperatureState;
}`;
  }

  public override get report(): string {
    if (this.config.device?.additionally?.toString().startsWith('Z-Wave')) {
      return `  // External temperature sensor for thermostat @pin${this.config.id} processing
    if (REPORT_SENSOR_MULTILEVEL_TYPE(report) == ZUNO_SENSOR_MULTILEVEL_TYPE_TEMPERATURE) {
      int temp = int(REPORT_SENSOR_MULTILEVEL_VALUE(report) * 10);

      if (REPORT_SENSOR_MULTILEVEL_SCALE(report) != SENSOR_MULTILEVEL_SCALE_CELSIUS) {
        // Conversion from degrees Fahrenheit to degrees Celsius
        temp = (temp - 32) * 5 / 9;
      }

      pin${this.config.id}ThermostatTemperatureCurrent = temp;
    }`;
    } else {
      return '';
    }
  }

  private getMode(invert = true): string {
    const condition
      = (this.config.device?.type === 'normal')
      === (this.config.device?.id === 'heatingThermostat');

    return invert === condition ? 'HIGH' : 'LOW';
  }

  public override get variables(): Action[] {
    return [{
      parentId: `pin${this.config.id}ThermostatModeState`,
      template: `pin${this.config.id}ThermostatModeState = {0};`,
      title: `Thermostat Mode #${this.config.id}`,
      parameters: [],
    },
      {
        parentId: `pin${this.config.id}ThermostatTemperatureState`,
        template: `pin${this.config.id}ThermostatTemperatureState = {0};`,
        title: `Thermostat Temperature #${this.config.id}`,
        parameters: [],
      },
      {
        parentId: `pin${this.config.id}ThermostatTemperatureCurrent`,
        template: `pin${this.config.id}ThermostatTemperatureCurrent = {0};`,
        title: `Thermostat Temperature Current #${this.config.id}`,
        parameters: [],
      }];
  }
}
