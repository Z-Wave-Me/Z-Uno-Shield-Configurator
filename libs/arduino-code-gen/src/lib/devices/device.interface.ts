export interface Device {
  includes?(): string;
  get note(): string;
  get name(): string | undefined;
  get vars(): string;
  get channel(): string;
  get setup(): string;
  loop(channel?: number): string;
  get xetter(): string;
  get report(): string;
  channels?: number;
}
