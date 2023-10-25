import { Device } from './devices/device.interface';

export class Generator implements Device {
  private channelBehaviour = 1;

  constructor(private readonly devices: Device[]) {}

  public get includes(): string | undefined {
    return this.collect('includes');
  }

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

  public get name(): string | undefined {
    return undefined;
  }

  public get note(): string {
    return this.collect('note', 2);
  }

  public get functions(): string {
    const functions = this.collect('functions');

    return functions.length ? `// Functions
    
${functions}

` : '';
  }

  public get report(): string {
    const report = this.collect('report', 1, ',\n');

    return report.length
      ? `void reportSMLHandler(ReportAuxData_t * report) {
${report} 
}

`
      : '';
  }

  public get reportTop(): string {
    return this.report.length
      ? `
// External SensorMultilevel reports handler
ZUNO_REPORTS_HANDLER(SensorMultilevel, reportSMLHandler);


`
      : '';
  }

  public get setup(): string {
    return `
void setup() {
${this.v10Mode}
${this.pwm}
${this.collect('setup')}
}

`;
  }

  public get v10Mode(): string {
    const enable = this.devices.some(device => 'v10Mode' in device && device['v10Mode']);

    return enable ? '  shield.init0_10V();\n': '';
  }

  public get pwm(): string {
    return this.collect('pwm');
  }

  public get vars(): string {
    const vars = this.collect('vars');

    return vars.length
      ? `// Global variables
${vars}

`
      : '';
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



  public loop(): string {
    return `
void loop() {
${this.collect('loop', 2)}

  delay(20);
}

`;
  }

  public code(): string {
    if (!this.devices.length) {
      return '// Please select features';
    }

    return `
#include "ZUNO_SHIELD.h" // Shield library
${this.includes}

${this.vars}
${this.channel}
${this.reportTop}
ZUNOShield shield; // Shield object
${this.setup}
${this.loop()}
${this.xetter}
${this.report}
${this.functions}`;
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
      .join(Array.from({ length: lineCount }).fill(sep).join(''));
  }

  // public output() {
  //   return {
  //     code: this.code,
  //     note: this.devices.map(device => ({
  //       id: device.name,
  //       note: device.note,
  //     })),
  //   }
  // }
}
