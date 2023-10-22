import { PinConfig } from '@configurator/shared';
import { BaseDevice } from './base-device';
import { SensorMultilevelDevices, VoltageOffset } from '@configurator/arduino-code-gen';


enum Precision {
  Zero = 'SENSOR_MULTILEVEL_PRECISION_ZERO_DECIMALS',
  One = 'SENSOR_MULTILEVEL_PRECISION_ONE_DECIMAL',
  Two = 'SENSOR_MULTILEVEL_PRECISION_TWO_DECIMALS',
}

enum Size {
  Byte = 'SENSOR_MULTILEVEL_SIZE_ONE_BYTE',
  Word = 'SENSOR_MULTILEVEL_SIZE_TWO_BYTES',
  Dword = 'SENSOR_MULTILEVEL_SIZE_FOUR_BYTES',
}

function sizeToType(size: Size): string {
  return Object.keys(Size)[Object.values(Size).indexOf(size)].toLowerCase();
}

interface SwitchMultilevelConfig {
  precision: Precision;
  size: Size;
  sensorType: string[];
}

export class SensorMultilevel extends BaseDevice {
  public override channels = 0;


  private readonly switchMultilevelConfig: SwitchMultilevelConfig;
  private readonly propertyMap: Record<
    SensorMultilevelDevices,
    SwitchMultilevelConfig
  > = {
    [SensorMultilevelDevices.Percentage]: {
      precision: Precision.Zero,
      size: Size.Byte,
      sensorType: [
        'ZUNO_SENSOR_MULTILEVEL_TYPE_GENERAL_PURPOSE_VALUE',
        'SENSOR_MULTILEVEL_SCALE_PERCENTAGE_VALUE',
      ],
    },
    [SensorMultilevelDevices.Temperature]: {
      precision: Precision.One,
      size: Size.Word,
      sensorType: [
        'ZUNO_SENSOR_MULTILEVEL_TYPE_TEMPERATURE',
        'SENSOR_MULTILEVEL_SCALE_CELSIUS',
      ],
    },
    [SensorMultilevelDevices.Luminance]: {
      precision: Precision.Zero,
      size: Size.Word,
      sensorType: [
        'ZUNO_SENSOR_MULTILEVEL_TYPE_LUMINANCE',
        'SENSOR_MULTILEVEL_SCALE_PERCENTAGE_VALUE',
      ],
    },
    [SensorMultilevelDevices.Ppm]: {
      precision: Precision.Zero,
      size: Size.Word,
      sensorType: [
        'ZUNO_SENSOR_MULTILEVEL_TYPE_CO2_LEVEL',
        'SENSOR_MULTILEVEL_SCALE_PARTS_PER_MILLION',
      ],
    },
    [SensorMultilevelDevices.Humidity]: {
      precision: Precision.One,
      size: Size.Byte,
      sensorType: [
        'ZUNO_SENSOR_MULTILEVEL_TYPE_RELATIVE_HUMIDITY',
        'SENSOR_MULTILEVEL_SCALE_PERCENTAGE_VALUE',
      ],
    },
    [SensorMultilevelDevices.Voltage]: {
      precision: Precision.One,
      size: Size.Word,
      sensorType: [
        'ZUNO_SENSOR_MULTILEVEL_TYPE_VOLTAGE',
        'SENSOR_MULTILEVEL_SCALE_VOLT',
      ],
    },
    [SensorMultilevelDevices.Current]: {
      precision: Precision.One,
      size: Size.Word,
      sensorType: [
        'ZUNO_SENSOR_MULTILEVEL_TYPE_CURRENT',
        'SENSOR_MULTILEVEL_SCALE_AMPERE',
      ],
    },
    [SensorMultilevelDevices.Distance]: {
      precision: Precision.One,
      size: Size.Word,
      sensorType: [
        'ZUNO_SENSOR_MULTILEVEL_TYPE_DISTANCE',
        'SENSOR_MULTILEVEL_SCALE_METER',
      ],
    },
    [SensorMultilevelDevices.Pressure]: {
      precision: Precision.Two,
      size: Size.Dword,
      sensorType: [
        'ZUNO_SENSOR_MULTILEVEL_TYPE_ATMOSPHERIC_PRESSURE',
        'SENSOR_MULTILEVEL_SCALE_KILO_PASCAL',
      ],
    },
  };

  private readonly jumperMap: Record<VoltageOffset, string> = {
    [VoltageOffset.V3]: 'SHIELD_ADC_JUMPER_IO3V',
    [VoltageOffset.V5]: 'SHIELD_ADC_JUMPER_I5V',
    [VoltageOffset.V12]: 'SHIELD_ADC_JUMPER_I12V',
    [VoltageOffset.Unset]: '',
  };

  constructor(protected override readonly config: PinConfig) {
    super(config);

    if (config.device?.id) {
      this.switchMultilevelConfig = this.propertyMap[config.device.id as SensorMultilevelDevices];
    } else {
      throw new Error('Unknown SensorMultilevelDevices type')
    }
  }

  public override get note(): string {
    return '- Reports are sent every 30 seconds'
  }
  public override get channel(): string {
    const channels = [...this.switchMultilevelConfig.sensorType, this.switchMultilevelConfig.precision, this.switchMultilevelConfig.size].join(', ');

    return `  ZUNO_SENSOR_MULTILEVEL(${channels}, pin${this.config.id}SensorMultilevelState)`;
  }

  public override loop(channel: number): string {
    // Number of Enum 0, 1, 2
    const precision = Object.values(Precision).indexOf(this.switchMultilevelConfig.precision);


    const lowerBound = (this.config.device?.lowerBound ?? 0) * Math.pow(10, precision);
    const upperBound = (this.config.device?.upperBound ?? 0) * Math.pow(10, precision);

    const offset = this.config.offset ?? 0;
    const base = (upperBound - lowerBound)/ offset;

    return `  // ADC SensorMultilevel@pin${this.config.id} process code
  pin${this.config.id}SensorMultilevelState = (${sizeToType(this.switchMultilevelConfig.size)}) round(${base.toFixed(5)} * shield.readADCVoltage(${this.config.id}) + ${lowerBound.toFixed(5)});
  if(pin${this.config.id}SensorMultilevelState != _pin${this.config.id}SensorMultilevelState){
    _pin${this.config.id}SensorMultilevelState = pin${this.config.id}SensorMultilevelState;
    zunoSendReport(${channel}); // report if value has changed
  }`;
  }

  public override get setup(): string {
    return `  shield.initADCChannel(${this.config.id}, ${this.jumper});`;
  }

  public override get vars(): string {
    return `${sizeToType(this.switchMultilevelConfig.size)} pin${this.config.id} SensorMultilevelState=0, _pin${this.config.id}SensorMultilevelState=1;`;
  }

  private get jumper(): string {
    return this.jumperMap[this.config.offset ?? VoltageOffset.Unset];
  }
}
