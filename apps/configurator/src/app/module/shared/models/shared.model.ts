import { DeviceType } from '@configurator/shared';
import {
  ColorDevices,
  SensorMultilevelDevices,
  VoltageOffset,
} from '@configurator/arduino-code-gen';
import { ZUnoDeviceGroup } from '../../../components/z-uno-shield/z-uno-shield.model';

export const digitalInput = [
  {
    title: $localize`General purpose`,
    value: 'general',
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
    value: 'glassbr',
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
    group: ZUnoDeviceGroup.Color,
  },
  {
    title: $localize`Green LED`,
    value: ColorDevices.Green,
    type: DeviceType.SwitchColor,
    group: ZUnoDeviceGroup.Color,

  },
  {
    title: $localize`Blue LED`,
    value: ColorDevices.Blue,
    type: DeviceType.SwitchColor,
    group: ZUnoDeviceGroup.Color,

  },
  {
    title: $localize`White LED`,
    value: ColorDevices.White,
    type: DeviceType.SwitchColor,
    group: ZUnoDeviceGroup.Color,

  },
];

export const colorOutput = [

]

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

export const roter = (type: DeviceType.RS485 | DeviceType.UART) =>
  [9600, 14400, 19200, 38400, 57600, 115200, 230400].map((value) => ({
    title: $localize`${value} kbps`,
    value,
    type,
  }));

export const adcConfig = [
  {
    key: 'analog input 3',
    title: $localize`Analog input 0-3 V`,
    options: analogInput,
    offset: VoltageOffset.V3,
    busBars: [1],
  },
  {
    key: 'analog input 5',
    title: $localize`Analog input 0-5 V`,
    options: analogInput,
    offset: VoltageOffset.V5,
    busBars: [2,3],
  },
  {
    key: 'analog input 15',
    title: $localize`Analog input 0-12 V`,
    options: analogInput,
    offset: VoltageOffset.V12,
    busBars: [0,3],
  },
  {
    key: 'digital input 3',
    title: $localize`Digital input 0/3 V`,
    withGround: 3,
    options: digitalInput,
    busBars: [1],
  },
  {
    key: 'digital input 5',
    title: $localize`Digital input 0/5 V`,
    withGround: 5,
    options: digitalInput,
    busBars: [2,3],
  },
  {
    key: 'digital input 15',
    title: $localize`Digital input 0/12 V`,
    withGround: 12,
    options: digitalInput,
    busBars: [0,3],
  },
  {
    key: 'digital output 3',
    title: $localize`Digital output 0/3 V`,
    options: digitalOutput,
    busBars: [1],
  },
];

export const ds18b20 = [{
  key: 'Temperature',
  title: $localize`Temperature`,
  options: Array.from({ length: 10 }).map((_, index) => ({
    title: $localize`${index + 1} sensor`,
    value: index + 1,
    type: DeviceType.DS18B20,
  })),
}]

export const temperatureHumidity = [{
  key: 'temperature-humidity',
  title: $localize`Temperature/humidity`,
  options: [
    {
      title: $localize`DHT11`,
      value: 'dht11',
      type: DeviceType.DHT,
    },
    {
      title: $localize`DHT22`,
      value: 'dht22',
      type: DeviceType.DHT,
    },
  ],
}];
