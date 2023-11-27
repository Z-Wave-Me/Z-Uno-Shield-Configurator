import { Device } from './devices/device.interface';

export class Generator implements Device {
  public channels = 1;

  constructor(
    private readonly devices: Device[],
  ) { }

  public get includes(): string | undefined {
    return this.collect('includes');
  }

  public get channel(): string {
    const channel = this.collect('channel', ',\n');

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
    return this.collect('note', '\n\n');
  }

  public get functions(): string {
    const functions = this.collect('functions');

    return functions.length ? `// Functions    
${functions}
` : '';
  }

  public get report(): string {
    const report = this.collect('report', ',\n');

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
${this.v10Mode}${this.pwm}${this.collect('setup')}
}
`;
  }

  public get v10Mode(): string {
    const enable = this.devices.some(device => 'v10Mode' in device && device['v10Mode']);

    return enable ? '  shield.init0_10V();\n': '';
  }

  public get pwm(): string {
    const pwm = this.collect('pwm', ' | ');

    return pwm.length ? `  shield.initPWM(${pwm});\n` : '';
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
    const xetter = this.collect('xetter');

    return xetter.length
      ? `
// Getters and setters
${xetter}
`
      : '';
  }



  public loop(): string {
    return `void loop() {
${this.collect('loop', '\n\n')}

  delay(20);
}`;
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
    sep = '\n',
    filter = Boolean,
  ): string {
    return this.devices
      .map((device) => {
        const handler = device[accessor];

        if (typeof handler === 'function') {
          this.channels += device.channels;

          return handler.call(device, this.channels - device.channels);
        }

        return handler;
      })
      .filter(filter)
      .join(sep);
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
