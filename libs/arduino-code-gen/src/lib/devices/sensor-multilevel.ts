import { PinConfig } from '@configurator/shared';
import { BaseDevice } from './base-device';


export class SensorMultilevel extends BaseDevice {
  public override channels = 1;

  constructor(protected override readonly config: PinConfig) {
    super(config)
  }

  public override get channel(): string {
    return `  ZUNO_SENSOR_MULTILEVEL(PPP4PPP, pin${this.config.id}SensorMultilevelState)`;
  }

  public override loop(channel: number): string {
    return `  // ADC SensorMultilevel@pin${this.config.id} process code
  pin${this.config.id}SensorMultilevelState = (PPP5PPP) round(PPP1PPP * shield.readADCVoltage(PPP6PPP) + PPP3PPP);
  if(pin${this.config.id}SensorMultilevelState != _pin${this.config.id}SensorMultilevelState){
    _pin${this.config.id}SensorMultilevelState = pin${this.config.id}SensorMultilevelState;
    zunoSendReport(${channel}); // report if value has changed
  }`;
  }

  public override get note(): string {
    return '- Reports are sent every 30 seconds';
  }

  public override get setup(): string {
    return '  shield.initADCChannel(PPP6PPP, PPP7PPP);';
  }

  public override get vars(): string {
    return `PPP5PPP pin${this.config.id}SensorMultilevelState=0, _pin${this.config.id}SensorMultilevelState=1;`;
  }
}
