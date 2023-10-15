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

export function deviceFromConfig(config: PinConfig): Device {
  switch (config.device?.deviceType) {
    case DeviceType.SwitchBinary:
      return new SwitchBinary(config);
    case DeviceType.Thermostat:
      return new Thermostat(config);
    case DeviceType.SwitchMultilevel:
      return new SwitchMultilevel(config);
    case DeviceType.SwitchColor:
      return new SwitchColor(config);
    case DeviceType.SensorBinary:
      return new SensorBinary(config);
    case DeviceType.SensorMultilevel:
      return new SensorMultilevel(config);
    case DeviceType.DHT:
      return new DHT(config);
    case DeviceType.DS18B20:
      return new DS18B20(config);
    case DeviceType.UART:
      return new UART(config);
    case DeviceType.RS485:
      return new RS485(config);
    default:
      throw new Error(`Unknown type 

${JSON.stringify(config, null, 2)}`);
  }
}

export function generateCode(devices: Device[]): string {
  return new Generator(devices).code();
}

export function generate(config: PinConfig[]): string {
  const excluded: Set<string | number | undefined> = new Set();

  return generateCode(config.filter(item => {
    if (item.device?.bindPin) {
      excluded.add(item.device.bindPin);
    }

    return !excluded.has(item?.id);
  }).map(deviceFromConfig));
}
