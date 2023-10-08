import { PinConfig } from '../../../../apps/configurator/src/app/services/store/pins-state.service';
import { DeviceType } from '../../../../apps/configurator/src/app/shared/device.model';
import { SwitchBinary } from './devices/switch-binary';
import { Device } from './devices/device.interface';
import { Thermostat } from './devices/thermostat';
import { SwitchMultilevel } from './devices/switch-multilevel';
import { SwitchColor } from './devices/switch-color';
import { SensorBinary } from './devices/sensor-binary';
import { Generator } from './generator';

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
      return new SwitchMultilevel(config);
    default:
      throw new Error('Unknown type');
  }
}

export function generateCode(devices: Device[]): string {
  return new Generator(devices).code();
}

export function generate(config: PinConfig[]): string {
  return generateCode(config.map(deviceFromConfig));
}
