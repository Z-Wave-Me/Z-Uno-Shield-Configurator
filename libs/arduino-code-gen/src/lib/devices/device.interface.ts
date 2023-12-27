export interface Device {
  get includes(): string | undefined;
  get note(): string;
  get name(): string | undefined;
  get vars(): string;
  get channel(): string;
  get setup(): string;
  loop(channel?: number): string;
  get xetter(): string;
  get report(): string;
  get functions(): string;
  get pwm(): string;
  get variables(): DeviceVariables[];
  notes(): Record<number, string>;
  channels: number;
}

export interface GeneratedData {
  code?: string;
  variables: DeviceVariables[];
  notes : Record<number, string>;
}

export interface DeviceVariables {
  code: string;
  title: string;
}
