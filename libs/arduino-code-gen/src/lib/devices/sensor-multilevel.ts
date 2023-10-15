import { Device } from './device.interface';
import { PinConfig } from '../../../../../apps/configurator/src/app/services/store/pins-state.service';

export class SensorMultilevel implements Device {
  public channels = 1;

  constructor(private readonly config: PinConfig) { }

  public get includes(): string | undefined {
    return undefined;
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

  public get name(): string | undefined {
    return undefined;
  }

  public get note(): string {
    return '- Reports are sent every 30 seconds';
  }

  public get report(): string {
    return '';
  }

  public get setup(): string {
    return '  shield.initADCChannel(PPP6PPP, PPP7PPP);';
  }

  public get vars(): string {
    return `PPP5PPP pin${this.config.id}SensorMultilevelState=0, _pin${this.config.id}SensorMultilevelState=1;`;
  }

  public get xetter(): string {
    return '';
  }

  public get functions(): string {
    return '';
  }
}
