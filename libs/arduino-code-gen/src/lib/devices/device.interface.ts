import { Action } from '@configurator/shared';

export interface Device {
  get includes(): string | undefined;
  get note(): string;
  get name(): string | undefined;
  get vars(): string;
  get channel(): string;
  get setup(): string;
  loop_pre(channel?: number): string;
  loop_post(channel?: number): string;
  get xetter(): string;
  get report(): string;
  get functions(): string;
  get pwm(): string;
  get variables(): Action[];
  notes(): Record<number, string>;
  channels: number;
}

export interface GeneratedData {
  code?: string;
  variables: Action[];
  notes : Record<number, string>;
}
