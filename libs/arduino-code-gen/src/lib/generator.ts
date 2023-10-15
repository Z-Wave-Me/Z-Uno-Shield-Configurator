import { Device } from './devices/device.interface';

export class Generator implements Device {
  private channelBehaviour = 1;
  constructor(private readonly devices: Device[]) {}

  public get channel(): string {
    const channel = this.collect('channel', 1, ',\n');

    return channel.length
      ? `
// Z-Wave channels
ZUNO_SETUP_CHANNELS(
${channel}
);


`
      : '';
  }

  public loop(): string {
    return `
void loop() {
${this.collect('loop', 2)}

  delay(20);
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
${this.loop()}
${this.xetter}`;
  }

  private collect(
    accessor: keyof Device,
    lineCount = 1,
    sep = '\n',
    filter = Boolean,
  ): string {
    return this.devices
      .map((device) => {
        const handler = device[accessor];

        if (typeof handler === 'function') {
          this.channelBehaviour += device.channels ?? 0;

          return handler.call(device, this.channelBehaviour);
        }

        return handler;
      })
      .filter(filter)
      .join(Array.from({ length: lineCount }).fill(sep).join());
  }
}
