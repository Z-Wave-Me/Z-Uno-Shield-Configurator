export interface Device {
  get note(): string;
  get name(): string | undefined;
  get vars(): string;
  get channel(): string;
  get setup(): string;
  get loop(): string;
  get xetter(): string;
  get report(): string;
  // get preAction(): string;
}
