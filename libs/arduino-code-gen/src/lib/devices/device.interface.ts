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
  channels?: number;
}
