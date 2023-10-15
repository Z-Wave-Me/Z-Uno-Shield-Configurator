import { Device } from './device.interface';
import { PinConfig } from '@configurator/shared';
import { BaseDevice } from './base-device';


export class SensorMultilevel extends BaseDevice {
  public channels = 1;

  constructor(protected readonly config: PinConfig) {
    super(config)
  }

  public get channel(): string {
    return `  ZUNO_SENSOR_MULTILEVEL(PPP4PPP, pin${this.config.id}SensorMultilevelState)`;
  }

  public loop(channel: number): string {
    return `  // ADC SensorMultilevel@pin${this.config.id} process code
  pin${this.config.id}SensorMultilevelState = (PPP5PPP) round(PPP1PPP * shield.readADCVoltage(PPP6PPP) + PPP3PPP);
  if(pin${this.config.id}SensorMultilevelState != _pin${this.config.id}SensorMultilevelState){
    _pin${this.config.id}SensorMultilevelState = pin${this.config.id}SensorMultilevelState;
    zunoSendReport(${channel}); // report if value has changed
  }`;
  }

  public get note(): string {
    return '- Reports are sent every 30 seconds';
  }

  public get setup(): string {
    return '  shield.initADCChannel(PPP6PPP, PPP7PPP);';
  }

  public get vars(): string {
    return `PPP5PPP pin${this.config.id}SensorMultilevelState=0, _pin${this.config.id}SensorMultilevelState=1;`;
  }
}
