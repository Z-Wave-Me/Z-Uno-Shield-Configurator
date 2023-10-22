import { DeviceType } from '@configurator/shared';
import {
  ColorDevices,
  SensorMultilevelDevices,
  VoltageOffset,
} from '@configurator/arduino-code-gen';

export const digitalInput = [
  {
    title: $localize`General purpose`,
    value: 'General purpose',
    type: DeviceType.SensorBinary,
  },
  {
    title: $localize`Door/window`,
    value: 'door',
    type: DeviceType.SensorBinary,
  },
  {
    title: $localize`Motion`,
    value: 'motion',
    type: DeviceType.SensorBinary,
  },
  {
    title: $localize`Smoke`,
    value: 'smoke',
    type: DeviceType.SensorBinary,
  },
  {
    title: $localize`Leakage`,
    value: 'leakage',
    type: DeviceType.SensorBinary,
  },
  {
    title: $localize`CO`,
    value: 'CO',
    type: DeviceType.SensorBinary,
  },
  {
    title: $localize`CO2`,
    value: 'CO2',
    type: DeviceType.SensorBinary,
  },
  {
    title: $localize`Heat`,
    value: 'heat',
    type: DeviceType.SensorBinary,
  },
  {
    title: $localize`Freeze`,
    value: 'freeze',
    type: DeviceType.SensorBinary,
  },
  {
    title: $localize`Tamper`,
    value: 'tamper',
    type: DeviceType.SensorBinary,
  },
  {
    title: $localize`Tilt`,
    value: 'tilt',
    type: DeviceType.SensorBinary,
  },
  {
    title: $localize`Glass break`,
    value: 'glass break',
    type: DeviceType.SensorBinary,
  },
].map((data) => ({ ...data, withType: true }));

export const digitalOutput = [
  {
    title: $localize`Switch`,
    value: 'switch',
    type: DeviceType.SwitchBinary,
  },
  {
    title: $localize`Door lock`,
    value: 'doorLock',
    type: DeviceType.SwitchBinary,
  },
  {
    title: $localize`Siren`,
    value: 'siren',
    type: DeviceType.SwitchBinary,
  },
  {
    title: $localize`Valve`,
    value: 'valve',
    type: DeviceType.SwitchBinary,
  },
  {
    title: $localize`Heating thermostat`,
    value: 'heatingThermostat',
    type: DeviceType.Thermostat,
    additionally: [
      {
        title: $localize`Z-Wave temp sensor`,
        value: 'Z-Wave temp sensor',
      },
      {
        title: $localize`DS18B20`,
        value: 'ds18b20',
        type: DeviceType.DS18B20,
      },
    ],
  },
  {
    title: $localize`Cooling thermostat`,
    value: 'coolingThermostat',
    type: DeviceType.Thermostat,
    additionally: [
      {
        title: $localize`Z-Wave temp sensor`,
        value: 'Z-Wave temp sensor',
      },
      {
        title: $localize`DS18B20`,
        value: 'ds18b20',
        type: DeviceType.DS18B20,
      },
    ],
  },
].map((data) => ({ ...data, withType: true }));

export const pwmOutput = [
  {
    title: $localize`Dimmer`,
    value: 'dimmer',
    type: DeviceType.SwitchMultilevel,
  },
  {
    title: $localize`Red LED`,
    value: ColorDevices.Red,
    type: DeviceType.SwitchColor,
  },
  {
    title: $localize`Green LED`,
    value: ColorDevices.Green,
    type: DeviceType.SwitchColor,
  },
  {
    title: $localize`Blue LED`,
    value: ColorDevices.Blue,
    type: DeviceType.SwitchColor,
  },
  {
    title: $localize`White LED`,
    value: ColorDevices.White,
    type: DeviceType.SwitchColor,
  },
];

export const analogInput = [
  {
    title: $localize`Percentages, %`,
    value: SensorMultilevelDevices.Percentage,
    type: DeviceType.SensorMultilevel,
  },
  {
    title: $localize`Temperature, °C`,
    value:  SensorMultilevelDevices.Temperature,
    type: DeviceType.SensorMultilevel,
  },
  {
    title: $localize`Luminance, lux`,
    value:  SensorMultilevelDevices.Luminance,
    type: DeviceType.SensorMultilevel,
  },
  {
    title: $localize`Humidity, %`,
    value:  SensorMultilevelDevices.Humidity,
    type: DeviceType.SensorMultilevel,
  },
  {
    title: $localize`Voltage, V`,
    value:  SensorMultilevelDevices.Voltage,
    type: DeviceType.SensorMultilevel,
  },
  {
    title: $localize`Current, A`,
    value:  SensorMultilevelDevices.Current,
    type: DeviceType.SensorMultilevel,
  },
  {
    title: $localize`Distance, m`,
    value:  SensorMultilevelDevices.Distance,
    type: DeviceType.SensorMultilevel,
  },
  {
    title: $localize`Pressure, kPa`,
    value:  SensorMultilevelDevices.Pressure,
    type: DeviceType.SensorMultilevel,
  },
  {
    title: $localize`CO2, ppm`,
    value: SensorMultilevelDevices.Ppm,
    type: DeviceType.SensorMultilevel,
  },
];

export const analogOutput = [
  {
    title: $localize`Dimmer`,
    value: 'dimmer',
    type: DeviceType.SwitchMultilevel,
  },
  {
    title: $localize`Red LED`,
    value: ColorDevices.Red,
    type: DeviceType.SwitchColor,
  },
  {
    title: $localize`Green LED`,
    value: ColorDevices.Green,
    type: DeviceType.SwitchColor,
  },
  {
    title: $localize`Blue LED`,
    value: ColorDevices.Blue,
    type: DeviceType.SwitchColor,
  },
  {
    title: $localize`White LED`,
    value: ColorDevices.White,
    type: DeviceType.SwitchColor,
  },
];

export const roter = (type: DeviceType.RS485 | DeviceType.UART, bindPin: string) =>
  [9600, 14400, 19200, 38400, 57600, 115200, 230400].map((value) => ({
    title: $localize`${value} kbps`,
    value,
    type,
    bindPin,
  }));

export const adcConfig = [
  {
    key: 'Analog input 0-3 V',
    title: $localize`Analog input 0-3 V`,
    options: analogInput,
    offset: VoltageOffset.V3,
  },
  {
    key: 'Analog input 0-5 V',
    title: $localize`Analog input 0-5 V`,
    options: analogInput,
    offset: VoltageOffset.V5,
  },
  {
    key: 'Analog input 0-12 V',
    title: $localize`Analog input 0-12 V`,
    options: analogInput,
    offset: VoltageOffset.V12,
  },
  {
    key: 'Digital input 0/3 V',
    title: $localize`Digital input 0/3 V`,
    withGround: 3,
    options: digitalInput,
  },
  {
    key: 'Digital input 0/5 V',
    title: $localize`Digital input 0/5 V`,
    withGround: 5,
    options: digitalInput,
  },
  {
    key: 'Digital input 0/12 V',
    title: $localize`Digital input 0/12 V`,
    withGround: 12,
    options: digitalInput,
  },
  {
    key: 'Digital output 0/3 V',
    title: $localize`Digital output 0/3 V`,
    options: digitalOutput,
  },
];