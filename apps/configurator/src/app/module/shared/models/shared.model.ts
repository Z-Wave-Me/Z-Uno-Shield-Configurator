import { DeviceType } from '../../../shared/device.model';

export const digitalInput = [
  {
    title: $localize`General purpose`,
    value: 'General purpose',
    type: DeviceType.SensorBinary,
  },
  {
    title: $localize`Door/window`,
    value: 'door-window',
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
    title: $localize`Overheat`,
    value: 'overheat',
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
    value: 'led red',
    type: DeviceType.SwitchColor,
  },
  {
    title: $localize`Green LED`,
    value: 'led green',
    type: DeviceType.SwitchColor,
  },
  {
    title: $localize`Blue LED`,
    value: 'led blue',
    type: DeviceType.SwitchColor,
  },
  {
    title: $localize`White LED`,
    value: 'led white',
    type: DeviceType.SwitchColor,
  },
];

export const analogInput = [
  {
    title: $localize`Percentages, %`,
    value: 'Percentages, %',
    type: DeviceType.SensorMultilevel,
  },
  {
    title: $localize`Temperature, °C`,
    value: 'Temperature, °C',
    type: DeviceType.SensorMultilevel,
  },
  {
    title: $localize`Luminance, lux`,
    value: 'Luminance, lux`',
    type: DeviceType.SensorMultilevel,
  },
  {
    title: $localize`Humidity, %`,
    value: 'Humidity, %',
    type: DeviceType.SensorMultilevel,
  },
  {
    title: $localize`Voltage, V`,
    value: 'Voltage, V',
    type: DeviceType.SensorMultilevel,
  },
  {
    title: $localize`Current, A`,
    value: 'Current, A',
    type: DeviceType.SensorMultilevel,
  },
  {
    title: $localize`Distance, m`,
    value: 'Distance, m',
    type: DeviceType.SensorMultilevel,
  },
  {
    title: $localize`Pressure, kPa`,
    value: 'Pressure, kPa',
    type: DeviceType.SensorMultilevel,
  },
  {
    title: $localize`CO2, ppm`,
    value: 'CO2, ppm',
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
    value: 'led red',
    type: DeviceType.SwitchColor,
  },
  {
    title: $localize`Green LED`,
    value: 'led green',
    type: DeviceType.SwitchColor,
  },
  {
    title: $localize`Blue LED`,
    value: 'led blue',
    type: DeviceType.SwitchColor,
  },
  {
    title: $localize`White LED`,
    value: 'led white',
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
    map: 3,
  },
  {
    key: 'Analog input 0-5 V',
    title: $localize`Analog input 0-5 V`,
    options: analogInput,
    map: 5,
  },
  {
    key: 'Analog input 0-12 V',
    title: $localize`Analog input 0-12 V`,
    options: analogInput,
    map: 12,
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
