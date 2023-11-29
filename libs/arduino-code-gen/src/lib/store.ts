import { PinConfig } from '@configurator/shared';
import { Association } from './association';

export interface Store {
  pins: PinConfig[];
  associations: Association[];
}
