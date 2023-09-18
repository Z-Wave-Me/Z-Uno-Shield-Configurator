export interface Device {
  get note(): string;
  get vars(): string;
  get channel(): string;
  get setup(): string;
  get loop(): string;
  get xetter(): string;
  get preAction(): string;
}
