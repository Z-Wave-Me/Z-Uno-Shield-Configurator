import { PinConfig } from '@configurator/shared';
import { Association } from './association';

export interface BoardConfig {
  pins: PinConfig[];
  associations: Association[];
}
