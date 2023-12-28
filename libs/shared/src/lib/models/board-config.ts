import { Action, PinConfig } from '@configurator/shared';
import { Association } from './association';

export interface Rule {
  expression: Expression,
  actions: Action[],
  elseBlock: Action[],
}

export interface BoardConfig {
  pins: PinConfig[];
  associations: Association[];
  rules: Rule[]
}


export type Expression = [string | number | null | undefined | Action, string, string | number | Action]
