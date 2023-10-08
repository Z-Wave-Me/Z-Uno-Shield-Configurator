import { Device } from './device.interface';
import { PinConfig } from '../../../../../apps/configurator/src/app/services/store/pins-state.service';

export class SensorMultilevel implements Device {
  constructor(private readonly config: PinConfig) { }

  public get channel(): string {
    return '  ZUNO_SENSOR_MULTILEVEL(PPP4PPP, pinXXXSensorMultilevelState)';
  }

  public get loop(): string {
    return `  // ADC SensorMultilevel@pinXXX process code
  pinXXXSensorMultilevelState = (PPP5PPP) round(PPP1PPP * shield.readADCVoltage(PPP6PPP) + PPP3PPP);
  if(pinXXXSensorMultilevelState != _pinXXXSensorMultilevelState){
    _pinXXXSensorMultilevelState = pinXXXSensorMultilevelState;
    zunoSendReport(NNN); // report if value has changed
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
    return 'PPP5PPP pinXXXSensorMultilevelState=0, _pinXXXSensorMultilevelState=1;';
  }

  public get xetter(): string {
    return '';
  }
}
