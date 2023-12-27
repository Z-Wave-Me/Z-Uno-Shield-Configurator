import { PinConfig } from '@configurator/shared';
import { Association } from './association';

export type Rule = any;

export interface BoardConfig {
  pins: PinConfig[];
  associations: Association[];
  rules: Rule[]
}

export interface RuleAction {
  action: string;
  parameters: number;
}

export type Expression = [string | number | null | undefined, string, string | number]
