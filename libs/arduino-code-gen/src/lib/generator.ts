import { Device } from './devices/device.interface';

export class Generator implements Device {
  constructor(private readonly devices: Device[]) {}

  public get channel(): string {
    return this.collect('channel', 1, ',\n');
  }

  public get loop(): string {
    return `
void loop() {
${this.collect('loop', 2)}
}

`;
  }

  public get name(): string | undefined {
    return undefined;
  }

  public get note(): string {
    return this.collect('note', 2);
  }

  public get report(): string {
    const report = this.collect('report', 1, ',\n');

    return report.length
      ? `
void reportSMLHandler(ReportAuxData_t * report) {
${report}
}

`
      : '';
  }

  public get setup(): string {
    return `
void setup() {
  ${this.collect('setup')};
}

`;
  }

  public get vars(): string {
    const vars = this.collect('vars');

    return vars.length ? vars : '';
  }

  public get xetter(): string {
    const xetter = this.collect('xetter', 2);

    return xetter.length
      ? `
// Getters and setters
${xetter}
`
      : '';
  }

  public code(): string {
    return `
#include "ZUNO_SHIELD.h" // Shield library


${this.vars}
${this.channel}
${this.report}
ZUNOShield shield; // Shield object
${this.setup}
${this.loop}
${this.xetter}`;
  }

  private collect(
    accessor: keyof Device,
    lineCount = 1,
    sep = '\n',
    filter = Boolean
  ): string {
    return this.devices
      .map((device) => device[accessor])
      .filter(filter)
      .join(Array.from({ length: lineCount }).fill(sep).join());
  }
}
