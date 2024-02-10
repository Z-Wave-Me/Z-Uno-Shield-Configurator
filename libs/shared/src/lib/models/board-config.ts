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
  rules: Rule[] | null;
  lastChangedTime?: number;
  lastSyncTime?: number;
  remoteUrl: string | null;
}


export type Expression = {
  expression: [Action | null, string, Action | null];
  operator?: Logical;
};

export enum Logical {
  or = 'or',
  and = 'and',
}
