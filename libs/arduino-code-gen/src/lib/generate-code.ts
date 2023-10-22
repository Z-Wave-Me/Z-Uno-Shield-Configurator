import { SwitchBinary } from './devices/switch-binary';
import { Device } from './devices/device.interface';
import { Thermostat } from './devices/thermostat';
import { SwitchMultilevel } from './devices/switch-multilevel';
import { SwitchColor } from './devices/switch-color';
import { SensorBinary } from './devices/sensor-binary';
import { Generator } from './generator';
import { DHT } from './devices/dht';
import { DS18B20 } from './devices/ds18-b20';
import { UART } from './devices/uart';
import { RS485 } from './devices/rs485';
import { DeviceType, PinConfig } from '@configurator/shared';
import { SensorMultilevel } from './devices/sensor-multilevel';

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
        return new SwitchMultilevel(config);
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

export function generateCode(devices: Device[]): string {
  return new Generator(devices).code();
}

export function generate(config: PinConfig[]): string {
  const groupedConfig = config.reduce<Record<string, PinConfig[] | PinConfig>>(
    (acc, cur) => {
      const key = cur.group ?? cur.device?.group;

      if (key) {
        const exist = (acc[key] ?? []) as PinConfig[];
        acc[key] = [...exist, cur];
      } else {
        acc[cur.id] = cur;
      }

      return acc;
    },
    {},
  );

  return generateCode(Object.values(groupedConfig).map(deviceFromConfig));
}
