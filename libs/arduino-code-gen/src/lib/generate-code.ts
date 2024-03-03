import { SwitchBinary } from './devices/switch-binary';
import { Device, GeneratedData } from './devices/device.interface';
import { Thermostat } from './devices/thermostat';
import { SwitchMultilevel10V } from './devices/switch-multilevel10-v';
import { SwitchColor } from './devices/switch-color';
import { SensorBinary } from './devices/sensor-binary';
import { Generator } from './generator';
import { DHT } from './devices/dht';
import { DS18B20 } from './devices/ds18-b20';
import { UART } from './devices/uart';
import { RS485 } from './devices/rs485';
import { Association, DeviceType, PinConfig, BoardConfig } from '@configurator/shared';
import { SensorMultilevel } from './devices/sensor-multilevel';
import { SwitchMultilevelPwm } from './devices/switch-multilevel-pwm';

const isSimple = <T>(value: T | T[]): value is T => !Array.isArray(value);
const isArray = <T>(value: T | T[]): value is T[] => Array.isArray(value);

export function deviceFromConfig(config: PinConfig | PinConfig[]): Device {
  if (isSimple(config)) {
    const type = config.device?.deviceType;
    switch (type) {
      case DeviceType.SwitchBinary:
        return new SwitchBinary(config);
      case DeviceType.Thermostat:
        return new Thermostat(config);
      case DeviceType.SwitchMultilevel:
        if (config.id.startsWith('PWM')) {
          return new SwitchMultilevelPwm(config);
        }

        return new SwitchMultilevel10V(config);
      case DeviceType.SensorBinary:
        return new SensorBinary(config);
      case DeviceType.SensorMultilevel:
        return new SensorMultilevel(config);
      case DeviceType.DHT:
        return new DHT(config);
      case DeviceType.DS18B20:
        return new DS18B20(config);
    }
  }

  if (isArray(config)) {
    const type = config[0]?.device?.deviceType;
    switch (type) {
      case DeviceType.SwitchColor:
        return new SwitchColor(config);
      case DeviceType.UART:
        return new UART(config);
      case DeviceType.RS485:
        return new RS485(config);
    }
  }

  throw new Error(`Unknown type

${JSON.stringify(config, null, 2)}`);
}

function generateCode(devices: Device[], associations: Association[]): GeneratedData {
  const generator = new Generator(devices, associations);

  return {
    code: generator.code(),
    variables: generator.variables,
    notes: generator.notes(),
  }
}

export function generate(store: BoardConfig): GeneratedData {
  const pinConfig = store.pins;
  const groupedConfig = pinConfig.reduce<Record<string,
    {
      order: number;
      data: PinConfig[] | PinConfig;
    }>>(
    (acc, cur, index) => {
      const key = cur.group ?? cur.device?.group;

      if (key) {
        const exist = (acc[key]?.data ?? []) as PinConfig[];
        acc[key] = {
          order: acc[key]?.order ?? index,
          data: [...exist, cur],
        };
      } else {
        acc[cur.id] = {
          order: index,
          data: cur,
        };
      }

      return acc;
    },
    {},
  );

  const sortedConfig = Object.values(groupedConfig).sort((
    {order: a},
    {order: b},
  ) => a - b)

  return generateCode(sortedConfig.map(({data}) => deviceFromConfig(data)), store.associations);
}
