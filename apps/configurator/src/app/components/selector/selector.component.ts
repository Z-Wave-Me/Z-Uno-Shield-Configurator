import { Component } from '@angular/core';
import {
  PinContainer,
  PinSelectedService,
} from '../../services/pin-selected/pin-selected.service';

@Component({
  selector: 'configurator-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss'],
})
export class SelectorComponent {
  public topPinList = [
    {
    title: 'PWM4', id: 'PWM4', pin: [{
      key: 'PWM', title: $localize`PWM output`, options: [{
        title: $localize`Dimmer`, value: 'dimmer',
      }, {
        title: $localize`Red LED`, value: 'led red',
      },{
        title: $localize`Green LED`, value: 'led green',
      },{
        title: $localize`Blue LED`, value: 'led blue',
      },{
        title: $localize`White LED`, value: 'led white',
      }],
    }, {
      key: 'digital', title: $localize`Digital output`, options: [{
        title: $localize`Switch`, value: 'switch', withType: true,
      }, {
        title: $localize`Door Lock`, value: 'doorLock', withType: true,
      }, {
        title: $localize`Siren`, value: 'siren', withType: true,
      }, {
        title: $localize`Valve`, value: 'valve', withType: true,
      }, {
        title: $localize`Heating thermostat`, value: 'heatingThermostat', withType: true, additionally: [{
          title: $localize`Z-Wave temp sensor`, value: 'Z-Wave temp sensor',
        }, {
          title: $localize`DS18B20`, value: 'DS18B20',
        }],
      }, {
        title: $localize`Cooling thermostat`, value: 'coolingThermostat', withType: true, additionally: [{
          title: $localize`Z-Wave temp sensor`, value: 'Z-Wave temp sensor',
        }, {
          title: $localize`DS18B20`, value: 'DS18B20',
        }],
      }],
    }],
  },

    {
      title: 'PWM3', id: 'PWM3', pin: [{
        key: 'PWM', title: $localize`PWM output `, options: [{
        title: $localize`Dimmer`, value: 'dimmer',
      }, {
        title: $localize`Red LED`, value: 'led red',
      },{
        title: $localize`Green LED`, value: 'led green',
      },{
        title: $localize`Blue LED`, value: 'led blue',
      },{
        title: $localize`White LED`, value: 'led white',
      }],
      }, {
        key: 'digital', title: $localize`Digital output `, options: [{
          title: $localize`Switch`, value: 'switch', withType: true,
        }, {
          title: $localize`Door Lock`, value: 'doorLock', withType: true,
        }, {
          title: $localize`Siren`, value: 'siren', withType: true,
        }, {
          title: $localize`Valve`, value: 'valve', withType: true,
        }, {
          title: $localize`Heating thermostat`, value: 'heatingThermostat', withType: true, additionally: [{
            title: $localize`Z-Wave temp sensor`, value: 'Z-Wave temp sensor',
          }, {
            title: $localize`DS18B20`, value: 'DS18B20',
          }],
        }, {
          title: $localize`Cooling thermostat`, value: 'coolingThermostat', withType: true, additionally: [{
            title: $localize`Z-Wave temp sensor`, value: 'Z-Wave temp sensor',
          }, {
            title: $localize`DS18B20`, value: 'DS18B20',
          }],
        }],
      }],
    },
    {
      title: 'PWM2', id: 'PWM2', pin: [{
        key: 'PWM', title: $localize`PWM output `, options: [{
        title: $localize`Dimmer`, value: 'dimmer',
      }, {
        title: $localize`Red LED`, value: 'led red',
      },{
        title: $localize`Green LED`, value: 'led green',
      },{
        title: $localize`Blue LED`, value: 'led blue',
      },{
        title: $localize`White LED`, value: 'led white',
      }],
      }, {
        key: 'digital', title: $localize`Digital output `, options: [{
          title: $localize`Switch`, value: 'switch', withType: true,
        }, {
          title: $localize`Door Lock`, value: 'doorLock', withType: true,
        }, {
          title: $localize`Siren`, value: 'siren', withType: true,
        }, {
          title: $localize`Valve`, value: 'valve', withType: true,
        }, {
          title: $localize`Heating thermostat`, value: 'heatingThermostat', withType: true, additionally: [{
            title: $localize`Z-Wave temp sensor`, value: 'Z-Wave temp sensor',
          }, {
            title: $localize`DS18B20`, value: 'DS18B20',
          }],
        }, {
          title: $localize`Cooling thermostat`, value: 'coolingThermostat', withType: true, additionally: [{
            title: $localize`Z-Wave temp sensor`, value: 'Z-Wave temp sensor',
          }, {
            title: $localize`DS18B20`, value: 'DS18B20',
          }],
        }],
      }],
    },
    {
      title: 'PWM1', id: 'PWM1', pin: [{
        key: 'PWM', title: $localize`PWM output `, options: [{
        title: $localize`Dimmer`, value: 'dimmer',
      }, {
        title: $localize`Red LED`, value: 'led red',
      },{
        title: $localize`Green LED`, value: 'led green',
      },{
        title: $localize`Blue LED`, value: 'led blue',
      },{
        title: $localize`White LED`, value: 'led white',
      }],
      }, {
        key: 'digital', title: $localize`Digital output `, options: [{
          title: $localize`Switch`, value: 'switch', withType: true,
        }, {
          title: $localize`Door lock`, value: 'doorLock', withType: true,
        }, {
          title: $localize`Siren`, value: 'siren', withType: true,
        }, {
          title: $localize`Valve`, value: 'valve', withType: true,
        }, {
          title: $localize`Heating thermostat`, value: 'heatingThermostat', withType: true, additionally: [{
            title: $localize`Z-Wave temp sensor`, value: 'Z-Wave temp sensor',
          }, {
            title: $localize`DS18B20`, value: 'DS18B20',
          }],
        },{
          title: $localize`Cooling thermostat`, value: 'coolingThermostat', withType: true, additionally: [{
            title: $localize`Z-Wave temp sensor`, value: 'Z-Wave temp sensor',
          }, {
            title: $localize`DS18B20`, value: 'DS18B20',
          }],
        }],
      }],
    },
    {
      title: '0-10V_1', id: '0-10V_1', pin: [{
        key: '0-10V', title: $localize`Analog output 0-10V`, options: [{
          title: $localize`Dimmer`, value: 'dimmer',
        }, {
          title: $localize`Red LED`, value: 'led red',
        },{
          title: $localize`Green LED`, value: 'led green',
        },{
          title: $localize`Blue LED`, value: 'led blue',
        },{
          title: $localize`White LED`, value: 'led white',
        }],
      }],
    },
    {
      title: '0-10V_2', id: '0-10V_2', pin: [{
        key: '0-10V', title: $localize`Analog output 0-10V`, options: [{
          title: $localize`Dimmer`, value: 'dimmer',
        }, {
          title: $localize`Red LED`, value: 'led red',
        },{
          title: $localize`Green LED`, value: 'led green',
        },{
          title: $localize`Blue LED`, value: 'led blue',
        },{
          title: $localize`White LED`, value: 'led white',
        }],
      }],
    },
    {
      title: '0-10V_3', id: '0-10V_3', pin: [{
        key: '0-10V', title: $localize`Analog output 0-10V`, options: [{
          title: $localize`Dimmer`, value: 'dimmer',
        }, {
          title: $localize`Red LED`, value: 'led red',
        },{
          title: $localize`Green LED`, value: 'led green',
        },{
          title: $localize`Blue LED`, value: 'led blue',
        },{
          title: $localize`White LED`, value: 'led white',
        }],
      }],
    },
    {
      title: '0-10V_4', id: '0-10V_4', pin: [{
        key: '0-10V', title: $localize`Analog output 0-10V`, options: [{
          title: $localize`Dimmer`, value: 'dimmer',
        }, {
          title: $localize`Red LED`, value: 'led red',
        },{
          title: $localize`Green LED`, value: 'led green',
        },{
          title: $localize`Blue LED`, value: 'led blue',
        },{
          title: $localize`White LED`, value: 'led white',
        }],
      }],
    },
  ]
  public bottomPinList = [   {
    title: '7, RS-A', id: '7,RS-A', pin: [{
      key: 'UART TX', title: $localize`UART TX`, options: [{
        title: $localize`9600 kbps`, value: '9600',
      }, {
        title: $localize`14400 kbps`, value: '14400',
      }, {
        title: $localize`19200 kbps`, value: '19200',
      }, {
        title: $localize`38400 kbps`, value: '38400',
      }, {
        title: $localize`57600 kbps`, value: '57600',
      }, {
        title: $localize`115200 kbps`, value: '115200',
      }, {
        title: $localize`230400 kbps`, value: '230400',
      }],
    }, {
      key: 'RS-485 A', title: $localize`RS-485 A`, options: [{
        title: $localize`9600 kbps`, value: '9600',
      }, {
        title: $localize`14400 kbps`, value: '14400',
      }, {
        title: $localize`19200 kbps`, value: '19200',
      }, {
        title: $localize`38400 kbps`, value: '38400',
      }, {
        title: $localize`57600 kbps`, value: '57600',
      }, {
        title: $localize`115200 kbps`, value: '115200',
      }, {
        title: $localize`230400 kbps`, value: '230400',
      }],
    }, {
      key: 'digital input', title: $localize`Digital input 0/3 V`, withGround: 3, options: [{
        title: $localize`General purpose`,value: 'General purpose', withType: true,
      }, {
        title: $localize`Door/window`, value: 'Door/window', withType: true,
      }, {
        title: $localize`Motion`, value: 'Motion', withType: true,
      }, {
        title: $localize`Smoke`, value: 'Smoke', withType: true,
      }, {
        title: $localize`Leakage`, value: 'Leakage', withType: true,
      },{
        title: $localize`CO`, value: 'CO', withType: true,
      },{
        title: $localize`CO2`, value: 'CO2', withType: true,
      },{
        title: $localize`Overheat`, value: 'Overheat', withType: true,
      },{
        title: $localize`Freeze`, value: 'Freeze', withType: true,
      },{
        title: $localize`Tamper`, value: 'Tamper', withType: true,
      },{
        title: $localize`Tilt`, value: 'Tilt', withType: true,
      },{
        title: $localize`Glass break`, value: 'Glass break', withType: true,
      }],
    },{
      key: 'digital output', title: $localize`Digital output 0/3 V`, options: [{
        title: $localize`Switch`,value: 'switch', withType: true,
      }, {
        title: $localize`Door lock`, value: 'doorLock', withType: true,
      }, {
        title: $localize`Siren`, value: 'siren', withType: true,
      }, {
        title: $localize`Valve`, value: 'valve', withType: true,
      }, {
        title: $localize`Heating thermostat`, value: 'heatingThermostat', withType: true, additionally: [{
          title: $localize`Z-Wave temp sensor`, value: 'Z-Wave temp sensor',
        }, {
          title: $localize`DS18B20`, value: 'DS18B20',
        }],
      }, {
        title: $localize`Cooling thermostat`, value: 'coolingThermostat', withType: true, additionally: [{
          title: $localize`Z-Wave temp sensor`, value: 'Z-Wave temp sensor',
        }, {
          title: $localize`DS18B20`, value: 'DS18B20',
        }],
      }],
    }],
  },
    {
      title: '8, RS-B', id: '8,RS-B', pin: [{
        key: 'UART RX', title: $localize`UART RX`, options: [{
          title: $localize`9600 kbps`, value: '9600',
        }, {
          title: $localize`14400 kbps`, value: '14400',
        }, {
          title: $localize`19200 kbps`, value: '19200',
        }, {
          title: $localize`38400 kbps`, value: '38400',
        }, {
          title: $localize`57600 kbps`, value: '57600',
        }, {
          title: $localize`115200 kbps`, value: '115200',
        }, {
          title: $localize`230400 kbps`, value: '230400',
        }],
      }, {
        key: 'RS-485 B', title: $localize`RS-485 B`, options: [{
          title: $localize`9600 kbps`, value: '9600',
        }, {
          title: $localize`14400 kbps`, value: '14400',
        }, {
          title: $localize`19200 kbps`, value: '19200',
        }, {
          title: $localize`38400 kbps`, value: '38400',
        }, {
          title: $localize`57600 kbps`, value: '57600',
        }, {
          title: $localize`115200 kbps`, value: '115200',
        }, {
          title: $localize`230400 kbps`, value: '230400',
        }],
      }, {
        key: 'digital input', title: $localize`Digital input 0/3 V`, withGround: 3, options: [{
          title: $localize`General purpose`,value: 'General purpose', withType: true,
        }, {
          title: $localize`Door/window`, value: 'Door/window', withType: true,
        }, {
          title: $localize`Motion`, value: 'Motion', withType: true,
        }, {
          title: $localize`Smoke`, value: 'Smoke', withType: true,
        }, {
          title: $localize`Leakage`, value: 'Leakage', withType: true,
        },{
          title: $localize`CO`, value: 'CO', withType: true,
        },{
          title: $localize`CO2`, value: 'CO2', withType: true,
        },{
          title: $localize`Overheat`, value: 'Overheat', withType: true,
        },{
          title: $localize`Freeze`, value: 'Freeze', withType: true,
        },{
          title: $localize`Tamper`, value: 'Tamper', withType: true,
        },{
          title: $localize`Tilt`, value: 'Tilt', withType: true,
        },{
          title: $localize`Glass break`, value: 'Glass break', withType: true,
        }],
      },{
        key: 'digital output', title: $localize`Digital output 0/3 V`, options: [{
          title: $localize`Switch`,value: 'switch', withType: true,
        }, {
          title: $localize`Door lock`, value: 'doorLock', withType: true,
        }, {
          title: $localize`Siren`, value: 'siren', withType: true,
        }, {
          title: $localize`Valve`, value: 'valve', withType: true,
        }, {
          title: $localize`Heating thermostat`, value: 'heatingThermostat', withType: true, additionally: [{
            title: $localize`Z-Wave temp sensor`, value: 'Z-Wave temp sensor',
          }, {
            title: $localize`DS18B20`, value: 'DS18B20',
          }],
        }, {
          title: $localize`Cooling thermostat`, value: 'coolingThermostat', withType: true, additionally: [{
            title: $localize`Z-Wave temp sensor`, value: 'Z-Wave temp sensor',
          }, {
            title: $localize`DS18B20`, value: 'DS18B20',
          }],
        }],
      }],
    },
    {
      title: '12', id: '12', pin: [{
        key: 'Temperature/humidity', title: $localize`Temperature/humidity`, options: [{
          title: $localize`DHT11`, value: 'DHT11',
        }, {
          title: $localize`DHT22`, value: 'DHT22',
        }],
      }, {
        key: 'digital input', title: $localize`Digital input 0/3 V`, withGround: 3, options: [{
          title: $localize`General purpose`,value: 'General purpose', withType: true,
        }, {
          title: $localize`Door/window`, value: 'Door/window', withType: true,
        }, {
          title: $localize`Motion`, value: 'Motion', withType: true,
        }, {
          title: $localize`Smoke`, value: 'Smoke', withType: true,
        }, {
          title: $localize`Leakage`, value: 'Leakage', withType: true,
        },{
          title: $localize`CO`, value: 'CO', withType: true,
        },{
          title: $localize`CO2`, value: 'CO2', withType: true,
        },{
          title: $localize`Overheat`, value: 'Overheat', withType: true,
        },{
          title: $localize`Freeze`, value: 'Freeze', withType: true,
        },{
          title: $localize`Tamper`, value: 'Tamper', withType: true,
        },{
          title: $localize`Tilt`, value: 'Tilt', withType: true,
        },{
          title: $localize`Glass break`, value: 'Glass break', withType: true,
        }],
      },{
        key: 'digital output', title: $localize`Digital output 0/3 V`, options: [{
          title: $localize`Switch`,value: 'switch', withType: true,
        }, {
          title: $localize`Door lock`, value: 'doorLock', withType: true,
        }, {
          title: $localize`Siren`, value: 'siren', withType: true,
        }, {
          title: $localize`Valve`, value: 'valve', withType: true,
        }, {
          title: $localize`Heating thermostat`, value: 'heatingThermostat', withType: true, additionally: [{
            title: $localize`Z-Wave temp sensor`, value: 'Z-Wave temp sensor',
          }, {
            title: $localize`DS18B20`, value: 'DS18B20',
          }],
        }, {
          title: $localize`Cooling thermostat`, value: 'coolingThermostat', withType: true, additionally: [{
            title: $localize`Z-Wave temp sensor`, value: 'Z-Wave temp sensor',
          }, {
            title: $localize`DS18B20`, value: 'DS18B20',
          }],
        }],
      }],
    },

    {
      title: '11, One Wire', id: '11, One Wire', pin: [{
        key: 'Temperature', title: $localize`Temperature`, options: [{
          title: $localize`1 sensor`, value: '1 sensor',
        }, {
          title: $localize`2 sensors`, value: '2 sensors',
        },{
          title: $localize`3 sensors`, value: '3 sensors',
        }, {
          title: $localize`4 sensors`, value: '4 sensors',
        },{
          title: $localize`5 sensors`, value: '5 sensors',
        }, {
          title: $localize`6 sensors`, value: '6 sensors',
        },{
          title: $localize`7 sensors`, value: '7 sensors',
        }, {
          title: $localize`8 sensors`, value: '8 sensors',
        },{
          title: $localize`9 sensors`, value: '9 sensors',
        }, {
          title: $localize`10 sensors`, value: '10 sensors',
        }],
      }, {
        key: 'Temperature/humidity', title: $localize`Temperature/humidity`, options: [{
          title: $localize`DHT11`, value: 'DHT11',
        }, {
          title: $localize`DHT22`, value: 'DHT22',
        }],
      }, {
        key: 'digital input', title: $localize`Digital input 0/3 V`, withGround: 3, options: [{
          title: $localize`General purpose`,value: 'General purpose', withType: true,
        }, {
          title: $localize`Door/window`, value: 'Door/window', withType: true,
        }, {
          title: $localize`Motion`, value: 'Motion', withType: true,
        }, {
          title: $localize`Smoke`, value: 'Smoke', withType: true,
        }, {
          title: $localize`Leakage`, value: 'Leakage', withType: true,
        },{
          title: $localize`CO`, value: 'CO', withType: true,
        },{
          title: $localize`CO2`, value: 'CO2', withType: true,
        },{
          title: $localize`Overheat`, value: 'Overheat', withType: true,
        },{
          title: $localize`Freeze`, value: 'Freeze', withType: true,
        },{
          title: $localize`Tamper`, value: 'Tamper', withType: true,
        },{
          title: $localize`Tilt`, value: 'Tilt', withType: true,
        },{
          title: $localize`Glass break`, value: 'Glass break', withType: true,
        }],
      },{
        key: 'digital output', title: $localize`Digital output 0/3 V `, options: [{
          title: $localize`Switch`,value: 'switch', withType: true,
        }, {
          title: $localize`Door lock`, value: 'doorLock', withType: true,
        }, {
          title: $localize`Siren`, value: 'siren', withType: true,
        }, {
          title: $localize`Valve`, value: 'valve', withType: true,
        }, {
          title: $localize`Heating thermostat`, value: 'heatingThermostat', withType: true, additionally: [{
            title: $localize`Z-Wave temp sensor`, value: 'Z-Wave temp sensor',
          }, {
            title: $localize`DS18B20`, value: 'DS18B20',
          }],
        }, {
          title: $localize`Cooling thermostat`, value: 'coolingThermostat', withType: true, additionally: [{
            title: $localize`Z-Wave temp sensor`, value: 'Z-Wave temp sensor',
          }, {
            title: $localize`DS18B20`, value: 'DS18B20',
          }],
        }],
      }],
    },

    {
      title: 'ADC3', id: 'ADC3', pin: [{
        key: 'Analog input 0-3 V', title: $localize`Analog input 0-3 V`, options: [{
          title: $localize`Percentages, %`, value: 'Percentages, %',
        }, {
          title: $localize`Temperature, °C`, value: 'Temperature, °C',
        },{
          title: $localize`Luminance, lux`, value: 'Luminance, lux`',
        }, {
          title: $localize`Humidity, %`, value: 'Humidity, %',
        },{
          title: $localize`Voltage, V`, value: 'Voltage, V',
        }, {
          title: $localize`Current, A`, value: 'Current, A',
        },{
          title: $localize`Distance, m`, value: 'Distance, m',
        }, {
          title: $localize`Pressure, kPa`, value: 'Pressure, kPa',
        },{
          title: $localize`CO2, ppm`, value: 'CO2, ppm',
        }],
      }, {
        key: 'Analog input 0-5 V', title: $localize`Analog input 0-5 V`, options: [{
          title: $localize`Percentages, %`, value: 'Percentages, %',
        }, {
          title: $localize`Temperature, °C`, value: 'Temperature, °C',
        },{
          title: $localize`Luminance, lux`, value: 'Luminance, lux`',
        }, {
          title: $localize`Humidity, %`, value: 'Humidity, %',
        },{
          title: $localize`Voltage, V`, value: 'Voltage, V',
        }, {
          title: $localize`Current, A`, value: 'Current, A',
        },{
          title: $localize`Distance, m`, value: 'Distance, m',
        }, {
          title: $localize`Pressure, kPa`, value: 'Pressure, kPa',
        },{
          title: $localize`CO2, ppm`, value: 'CO2, ppm',
        }],
      }, {
        key: 'Analog input 0-12 V', title: $localize`Analog input 0-12 V`, options: [{
          title: $localize`Percentages, %`, value: 'Percentages, %',
        }, {
          title: $localize`Temperature, °C`, value: 'Temperature, °C',
        },{
          title: $localize`Luminance, lux`, value: 'Luminance, lux`',
        }, {
          title: $localize`Humidity, %`, value: 'Humidity, %',
        },{
          title: $localize`Voltage, V`, value: 'Voltage, V',
        }, {
          title: $localize`Current, A`, value: 'Current, A',
        },{
          title: $localize`Distance, m`, value: 'Distance, m',
        }, {
          title: $localize`Pressure, kPa`, value: 'Pressure, kPa',
        },{
          title: $localize`CO2, ppm`, value: 'CO2, ppm',
        }],
      }, {
        key: 'Digital input 0/3 V', title: $localize`Digital input 0/3 V`, withGround: 3, options: [{
          title: $localize`General purpose`,value: 'General purpose', withType: true,
        }, {
          title: $localize`Door/window`, value: 'Door/window', withType: true,
        }, {
          title: $localize`Motion`, value: 'Motion', withType: true,
        }, {
          title: $localize`Smoke`, value: 'Smoke', withType: true,
        }, {
          title: $localize`Leakage`, value: 'Leakage', withType: true,
        },{
          title: $localize`CO`, value: 'CO', withType: true,
        },{
          title: $localize`CO2`, value: 'CO2', withType: true,
        },{
          title: $localize`Overheat`, value: 'Overheat', withType: true,
        },{
          title: $localize`Freeze`, value: 'Freeze', withType: true,
        },{
          title: $localize`Tamper`, value: 'Tamper', withType: true,
        },{
          title: $localize`Tilt`, value: 'Tilt', withType: true,
        },{
          title: $localize`Glass break`, value: 'Glass break', withType: true,
        }],
      }, {
        key: 'Digital input 0/5 V', title: $localize`Digital input 0/5 V`, withGround: 5, options: [{
          title: $localize`General purpose`,value: 'General purpose', withType: true,
        }, {
          title: $localize`Door/window`, value: 'Door/window', withType: true,
        }, {
          title: $localize`Motion`, value: 'Motion', withType: true,
        }, {
          title: $localize`Smoke`, value: 'Smoke', withType: true,
        }, {
          title: $localize`Leakage`, value: 'Leakage', withType: true,
        },{
          title: $localize`CO`, value: 'CO', withType: true,
        },{
          title: $localize`CO2`, value: 'CO2', withType: true,
        },{
          title: $localize`Overheat`, value: 'Overheat', withType: true,
        },{
          title: $localize`Freeze`, value: 'Freeze', withType: true,
        },{
          title: $localize`Tamper`, value: 'Tamper', withType: true,
        },{
          title: $localize`Tilt`, value: 'Tilt', withType: true,
        },{
          title: $localize`Glass break`, value: 'Glass break', withType: true,
        }],
      }, {
        key: 'Digital input 0/12 V', title: $localize`Digital input 0/12 V`, withGround: 12, options: [{
          title: $localize`General purpose`,value: 'General purpose', withType: true,
        }, {
          title: $localize`Door/window`, value: 'Door/window', withType: true,
        }, {
          title: $localize`Motion`, value: 'Motion', withType: true,
        }, {
          title: $localize`Smoke`, value: 'Smoke', withType: true,
        }, {
          title: $localize`Leakage`, value: 'Leakage', withType: true,
        },{
          title: $localize`CO`, value: 'CO', withType: true,
        },{
          title: $localize`CO2`, value: 'CO2', withType: true,
        },{
          title: $localize`Overheat`, value: 'Overheat', withType: true,
        },{
          title: $localize`Freeze`, value: 'Freeze', withType: true,
        },{
          title: $localize`Tamper`, value: 'Tamper', withType: true,
        },{
          title: $localize`Tilt`, value: 'Tilt', withType: true,
        },{
          title: $localize`Glass break`, value: 'Glass break', withType: true,
        }],
      }, {
        key: 'Digital output 0/3 V', title: $localize`Digital output 0/3 V`, options: [{
          title: $localize`Switch`,value: 'switch', withType: true,
        }, {
          title: $localize`Door lock`, value: 'doorLock', withType: true,
        }, {
          title: $localize`Siren`, value: 'siren', withType: true,
        }, {
          title: $localize`Valve`, value: 'valve', withType: true,
        }, {
          title: $localize`Heating thermostat`, value: 'heatingThermostat', withType: true, additionally: [{
            title: $localize`Z-Wave temp sensor`, value: 'Z-Wave temp sensor',
          }, {
            title: $localize`DS18B20`, value: 'DS18B20',
          }],
        }, {
          title: $localize`Cooling thermostat`, value: 'coolingThermostat', withType: true, additionally: [{
            title: $localize`Z-Wave temp sensor`, value: 'Z-Wave temp sensor',
          }, {
            title: $localize`DS18B20`, value: 'DS18B20',
          }],
        }],
      }],
    },
    {
      title: 'ADC2', id: 'ADC2', pin: [{
        key: 'Analog input 0-3 V', title: $localize`Analog input 0-3 V`, options: [{
          title: $localize`Percentages, %`, value: 'Percentages, %',
        }, {
          title: $localize`Temperature, °C`, value: 'Temperature, °C',
        },{
          title: $localize`Luminance, lux`, value: 'Luminance, lux`',
        }, {
          title: $localize`Humidity, %`, value: 'Humidity, %',
        },{
          title: $localize`Voltage, V`, value: 'Voltage, V',
        }, {
          title: $localize`Current, A`, value: 'Current, A',
        },{
          title: $localize`Distance, m`, value: 'Distance, m',
        }, {
          title: $localize`Pressure, kPa`, value: 'Pressure, kPa',
        },{
          title: $localize`CO2, ppm`, value: 'CO2, ppm',
        }],
      }, {
        key: 'Analog input 0-5 V', title: $localize`Analog input 0-5 V`, options: [{
          title: $localize`Percentages, %`, value: 'Percentages, %',
        }, {
          title: $localize`Temperature, °C`, value: 'Temperature, °C',
        },{
          title: $localize`Luminance, lux`, value: 'Luminance, lux`',
        }, {
          title: $localize`Humidity, %`, value: 'Humidity, %',
        },{
          title: $localize`Voltage, V`, value: 'Voltage, V',
        }, {
          title: $localize`Current, A`, value: 'Current, A',
        },{
          title: $localize`Distance, m`, value: 'Distance, m',
        }, {
          title: $localize`Pressure, kPa`, value: 'Pressure, kPa',
        },{
          title: $localize`CO2, ppm`, value: 'CO2, ppm',
        }],
      }, {
        key: 'Analog input 0-12 V', title: $localize`Analog input 0-12 V`, options: [{
          title: $localize`Percentages, %`, value: 'Percentages, %',
        }, {
          title: $localize`Temperature, °C`, value: 'Temperature, °C',
        },{
          title: $localize`Luminance, lux`, value: 'Luminance, lux`',
        }, {
          title: $localize`Humidity, %`, value: 'Humidity, %',
        },{
          title: $localize`Voltage, V`, value: 'Voltage, V',
        }, {
          title: $localize`Current, A`, value: 'Current, A',
        },{
          title: $localize`Distance, m`, value: 'Distance, m',
        }, {
          title: $localize`Pressure, kPa`, value: 'Pressure, kPa',
        },{
          title: $localize`CO2, ppm`, value: 'CO2, ppm',
        }],
      }, {
        key: 'Digital input 0/3 V', title: $localize`Digital input 0/3 V`, withGround: 3, options: [{
          title: $localize`General purpose`,value: 'General purpose', withType: true,
        }, {
          title: $localize`Door/window`, value: 'Door/window', withType: true,
        }, {
          title: $localize`Motion`, value: 'Motion', withType: true,
        }, {
          title: $localize`Smoke`, value: 'Smoke', withType: true,
        }, {
          title: $localize`Leakage`, value: 'Leakage', withType: true,
        },{
          title: $localize`CO`, value: 'CO', withType: true,
        },{
          title: $localize`CO2`, value: 'CO2', withType: true,
        },{
          title: $localize`Overheat`, value: 'Overheat', withType: true,
        },{
          title: $localize`Freeze`, value: 'Freeze', withType: true,
        },{
          title: $localize`Tamper`, value: 'Tamper', withType: true,
        },{
          title: $localize`Tilt`, value: 'Tilt', withType: true,
        },{
          title: $localize`Glass break`, value: 'Glass break', withType: true,
        }],
      }, {
        key: 'Digital input 0/5 V', title: $localize`Digital input 0/5 V`, withGround: 5, options: [{
          title: $localize`General purpose`,value: 'General purpose', withType: true,
        }, {
          title: $localize`Door/window`, value: 'Door/window', withType: true,
        }, {
          title: $localize`Motion`, value: 'Motion', withType: true,
        }, {
          title: $localize`Smoke`, value: 'Smoke', withType: true,
        }, {
          title: $localize`Leakage`, value: 'Leakage', withType: true,
        },{
          title: $localize`CO`, value: 'CO', withType: true,
        },{
          title: $localize`CO2`, value: 'CO2', withType: true,
        },{
          title: $localize`Overheat`, value: 'Overheat', withType: true,
        },{
          title: $localize`Freeze`, value: 'Freeze', withType: true,
        },{
          title: $localize`Tamper`, value: 'Tamper', withType: true,
        },{
          title: $localize`Tilt`, value: 'Tilt', withType: true,
        },{
          title: $localize`Glass break`, value: 'Glass break', withType: true,
        }],
      }, {
        key: 'Digital input 0/12 V', title: $localize`Digital input 0/12 V`, withGround: 12, options: [{
          title: $localize`General purpose`,value: 'General purpose', withType: true,
        }, {
          title: $localize`Door/window`, value: 'Door/window', withType: true,
        }, {
          title: $localize`Motion`, value: 'Motion', withType: true,
        }, {
          title: $localize`Smoke`, value: 'Smoke', withType: true,
        }, {
          title: $localize`Leakage`, value: 'Leakage', withType: true,
        },{
          title: $localize`CO`, value: 'CO', withType: true,
        },{
          title: $localize`CO2`, value: 'CO2', withType: true,
        },{
          title: $localize`Overheat`, value: 'Overheat', withType: true,
        },{
          title: $localize`Freeze`, value: 'Freeze', withType: true,
        },{
          title: $localize`Tamper`, value: 'Tamper', withType: true,
        },{
          title: $localize`Tilt`, value: 'Tilt', withType: true,
        },{
          title: $localize`Glass break`, value: 'Glass break', withType: true,
        }],
      }, {
        key: 'Digital output 0/3 V', title: $localize`Digital output 0/3 V`, options: [{
          title: $localize`Switch`,value: 'switch', withType: true,
        }, {
          title: $localize`Door lock`, value: 'doorLock', withType: true,
        }, {
          title: $localize`Siren`, value: 'siren', withType: true,
        }, {
          title: $localize`Valve`, value: 'valve', withType: true,
        }, {
          title: $localize`Heating thermostat`, value: 'heatingThermostat', withType: true, additionally: [{
            title: $localize`Z-Wave temp sensor`, value: 'Z-Wave temp sensor',
          }, {
            title: $localize`DS18B20`, value: 'DS18B20',
          }],
        }, {
          title: $localize`Cooling thermostat`, value: 'coolingThermostat', withType: true, additionally: [{
            title: $localize`Z-Wave temp sensor`, value: 'Z-Wave temp sensor',
          }, {
            title: $localize`DS18B20`, value: 'DS18B20',
          }],
        }],
      }],
    },
    { title: 'ADC1', id: 'ADC1', pin: [{
        key: 'Analog input 0-3 V', title: $localize`Analog input 0-3 V`, options: [{
          title: $localize`Percentages, %`, value: 'Percentages, %',
        }, {
          title: $localize`Temperature, °C`, value: 'Temperature, °C',
        },{
          title: $localize`Luminance, lux`, value: 'Luminance, lux`',
        }, {
          title: $localize`Humidity, %`, value: 'Humidity, %',
        },{
          title: $localize`Voltage, V`, value: 'Voltage, V',
        }, {
          title: $localize`Current, A`, value: 'Current, A',
        },{
          title: $localize`Distance, m`, value: 'Distance, m',
        }, {
          title: $localize`Pressure, kPa`, value: 'Pressure, kPa',
        },{
          title: $localize`CO2, ppm`, value: 'CO2, ppm',
        }],
      }, {
        key: 'Analog input 0-5 V', title: $localize`Analog input 0-5 V`, options: [{
          title: $localize`Percentages, %`, value: 'Percentages, %',
        }, {
          title: $localize`Temperature, °C`, value: 'Temperature, °C',
        },{
          title: $localize`Luminance, lux`, value: 'Luminance, lux`',
        }, {
          title: $localize`Humidity, %`, value: 'Humidity, %',
        },{
          title: $localize`Voltage, V`, value: 'Voltage, V',
        }, {
          title: $localize`Current, A`, value: 'Current, A',
        },{
          title: $localize`Distance, m`, value: 'Distance, m',
        }, {
          title: $localize`Pressure, kPa`, value: 'Pressure, kPa',
        },{
          title: $localize`CO2, ppm`, value: 'CO2, ppm',
        }],
      }, {
        key: 'Analog input 0-12 V', title: $localize`Analog input 0-12 V`, options: [{
          title: $localize`Percentages, %`, value: 'Percentages, %',
        }, {
          title: $localize`Temperature, °C`, value: 'Temperature, °C',
        },{
          title: $localize`Luminance, lux`, value: 'Luminance, lux`',
        }, {
          title: $localize`Humidity, %`, value: 'Humidity, %',
        },{
          title: $localize`Voltage, V`, value: 'Voltage, V',
        }, {
          title: $localize`Current, A`, value: 'Current, A',
        },{
          title: $localize`Distance, m`, value: 'Distance, m',
        }, {
          title: $localize`Pressure, kPa`, value: 'Pressure, kPa',
        },{
          title: $localize`CO2, ppm`, value: 'CO2, ppm',
        }],
      }, {
        key: 'Digital input 0/3 V', title: $localize`Digital input 0/3 V`, withGround: 3, options: [{
          title: $localize`General purpose`,value: 'General purpose', withType: true,
        }, {
          title: $localize`Door/window`, value: 'Door/window', withType: true,
        }, {
          title: $localize`Motion`, value: 'Motion', withType: true,
        }, {
          title: $localize`Smoke`, value: 'Smoke', withType: true,
        }, {
          title: $localize`Leakage`, value: 'Leakage', withType: true,
        },{
          title: $localize`CO`, value: 'CO', withType: true,
        },{
          title: $localize`CO2`, value: 'CO2', withType: true,
        },{
          title: $localize`Overheat`, value: 'Overheat', withType: true,
        },{
          title: $localize`Freeze`, value: 'Freeze', withType: true,
        },{
          title: $localize`Tamper`, value: 'Tamper', withType: true,
        },{
          title: $localize`Tilt`, value: 'Tilt', withType: true,
        },{
          title: $localize`Glass break`, value: 'Glass break', withType: true,
        }],
      }, {
        key: 'Digital input 0/5 V', title: $localize`Digital input 0/5 V`, withGround: 5, options: [{
          title: $localize`General purpose`,value: 'General purpose', withType: true,
        }, {
          title: $localize`Door/window`, value: 'Door/window', withType: true,
        }, {
          title: $localize`Motion`, value: 'Motion', withType: true,
        }, {
          title: $localize`Smoke`, value: 'Smoke', withType: true,
        }, {
          title: $localize`Leakage`, value: 'Leakage', withType: true,
        },{
          title: $localize`CO`, value: 'CO', withType: true,
        },{
          title: $localize`CO2`, value: 'CO2', withType: true,
        },{
          title: $localize`Overheat`, value: 'Overheat', withType: true,
        },{
          title: $localize`Freeze`, value: 'Freeze', withType: true,
        },{
          title: $localize`Tamper`, value: 'Tamper', withType: true,
        },{
          title: $localize`Tilt`, value: 'Tilt', withType: true,
        },{
          title: $localize`Glass break`, value: 'Glass break', withType: true,
        }],
      }, {
        key: 'Digital input 0/12 V', title: $localize`Digital input 0/12 V`, withGround: 12, options: [{
          title: $localize`General purpose`,value: 'General purpose', withType: true,
        }, {
          title: $localize`Door/window`, value: 'Door/window', withType: true,
        }, {
          title: $localize`Motion`, value: 'Motion', withType: true,
        }, {
          title: $localize`Smoke`, value: 'Smoke', withType: true,
        }, {
          title: $localize`Leakage`, value: 'Leakage', withType: true,
        },{
          title: $localize`CO`, value: 'CO', withType: true,
        },{
          title: $localize`CO2`, value: 'CO2', withType: true,
        },{
          title: $localize`Overheat`, value: 'Overheat', withType: true,
        },{
          title: $localize`Freeze`, value: 'Freeze', withType: true,
        },{
          title: $localize`Tamper`, value: 'Tamper', withType: true,
        },{
          title: $localize`Tilt`, value: 'Tilt', withType: true,
        },{
          title: $localize`Glass break`, value: 'Glass break', withType: true,
        }],
      }, {
        key: 'Digital output 0/3 V', title: $localize`Digital output 0/3 V`, options: [{
          title: $localize`Switch`,value: 'switch', withType: true,
        }, {
          title: $localize`Door lock`, value: 'doorLock', withType: true,
        }, {
          title: $localize`Siren`, value: 'siren', withType: true,
        }, {
          title: $localize`Valve`, value: 'valve', withType: true,
        }, {
          title: $localize`Heating thermostat`, value: 'heatingThermostat', withType: true, additionally: [{
            title: $localize`Z-Wave temp sensor`, value: 'Z-Wave temp sensor',
          }, {
            title: $localize`DS18B20`, value: 'DS18B20',
          }],
        }, {
          title: $localize`Cooling thermostat`, value: 'coolingThermostat', withType: true, additionally: [{
            title: $localize`Z-Wave temp sensor`, value: 'Z-Wave temp sensor',
          }, {
            title: $localize`DS18B20`, value: 'DS18B20',
          }],
        }],
      }],
    },

    {
      title: 'ADC0', id: 'ADC0', pin: [{
        key: 'Analog input 0-3 V', title: $localize`Analog input 0-3 V`, options: [{
          title: $localize`Percentages, %`, value: 'Percentages, %',
        }, {
          title: $localize`Temperature, °C`, value: 'Temperature, °C',
        },{
          title: $localize`Luminance, lux`, value: 'Luminance, lux`',
        }, {
          title: $localize`Humidity, %`, value: 'Humidity, %',
        },{
          title: $localize`Voltage, V`, value: 'Voltage, V',
        }, {
          title: $localize`Current, A`, value: 'Current, A',
        },{
          title: $localize`Distance, m`, value: 'Distance, m',
        }, {
          title: $localize`Pressure, kPa`, value: 'Pressure, kPa',
        },{
          title: $localize`CO2, ppm`, value: 'CO2, ppm',
        }],
      }, {
        key: 'Analog input 0-5 V', title: $localize`Analog input 0-5 V`, options: [{
          title: $localize`Percentages, %`, value: 'Percentages, %',
        }, {
          title: $localize`Temperature, °C`, value: 'Temperature, °C',
        },{
          title: $localize`Luminance, lux`, value: 'Luminance, lux`',
        }, {
          title: $localize`Humidity, %`, value: 'Humidity, %',
        },{
          title: $localize`Voltage, V`, value: 'Voltage, V',
        }, {
          title: $localize`Current, A`, value: 'Current, A',
        },{
          title: $localize`Distance, m`, value: 'Distance, m',
        }, {
          title: $localize`Pressure, kPa`, value: 'Pressure, kPa',
        },{
          title: $localize`CO2, ppm`, value: 'CO2, ppm',
        }],
      }, {
        key: 'Analog input 0-12 V', title: $localize`Analog input 0-12 V`, options: [{
          title: $localize`Percentages, %`, value: 'Percentages, %',
        }, {
          title: $localize`Temperature, °C`, value: 'Temperature, °C',
        },{
          title: $localize`Luminance, lux`, value: 'Luminance, lux`',
        }, {
          title: $localize`Humidity, %`, value: 'Humidity, %',
        },{
          title: $localize`Voltage, V`, value: 'Voltage, V',
        }, {
          title: $localize`Current, A`, value: 'Current, A',
        },{
          title: $localize`Distance, m`, value: 'Distance, m',
        }, {
          title: $localize`Pressure, kPa`, value: 'Pressure, kPa',
        },{
          title: $localize`CO2, ppm`, value: 'CO2, ppm',
        }],
      }, {
        key: 'Digital input 0/3 V', title: $localize`Digital input 0/3 V`, withGround: 3, options: [{
          title: $localize`General purpose`,value: 'General purpose', withType: true,
        }, {
          title: $localize`Door/window`, value: 'Door/window', withType: true,
        }, {
          title: $localize`Motion`, value: 'Motion', withType: true,
        }, {
          title: $localize`Smoke`, value: 'Smoke', withType: true,
        }, {
          title: $localize`Leakage`, value: 'Leakage', withType: true,
        },{
          title: $localize`CO`, value: 'CO', withType: true,
        },{
          title: $localize`CO2`, value: 'CO2', withType: true,
        },{
          title: $localize`Overheat`, value: 'Overheat', withType: true,
        },{
          title: $localize`Freeze`, value: 'Freeze', withType: true,
        },{
          title: $localize`Tamper`, value: 'Tamper', withType: true,
        },{
          title: $localize`Tilt`, value: 'Tilt', withType: true,
        },{
          title: $localize`Glass break`, value: 'Glass break', withType: true,
        }],
      }, {
        key: 'Digital input 0/5 V', title: $localize`Digital input 0/5 V`, withGround: 5, options: [{
          title: $localize`General purpose`,value: 'General purpose', withType: true,
        }, {
          title: $localize`Door/window`, value: 'Door/window', withType: true,
        }, {
          title: $localize`Motion`, value: 'Motion', withType: true,
        }, {
          title: $localize`Smoke`, value: 'Smoke', withType: true,
        }, {
          title: $localize`Leakage`, value: 'Leakage', withType: true,
        },{
          title: $localize`CO`, value: 'CO', withType: true,
        },{
          title: $localize`CO2`, value: 'CO2', withType: true,
        },{
          title: $localize`Overheat`, value: 'Overheat', withType: true,
        },{
          title: $localize`Freeze`, value: 'Freeze', withType: true,
        },{
          title: $localize`Tamper`, value: 'Tamper', withType: true,
        },{
          title: $localize`Tilt`, value: 'Tilt', withType: true,
        },{
          title: $localize`Glass break`, value: 'Glass break', withType: true,
        }],
      }, {
        key: 'Digital input 0/12 V', title: $localize`Digital input 0/12 V`, withGround: 12, options: [{
          title: $localize`General purpose`,value: 'General purpose', withType: true,
        }, {
          title: $localize`Door/window`, value: 'Door/window', withType: true,
        }, {
          title: $localize`Motion`, value: 'Motion', withType: true,
        }, {
          title: $localize`Smoke`, value: 'Smoke', withType: true,
        }, {
          title: $localize`Leakage`, value: 'Leakage', withType: true,
        },{
          title: $localize`CO`, value: 'CO', withType: true,
        },{
          title: $localize`CO2`, value: 'CO2', withType: true,
        },{
          title: $localize`Overheat`, value: 'Overheat', withType: true,
        },{
          title: $localize`Freeze`, value: 'Freeze', withType: true,
        },{
          title: $localize`Tamper`, value: 'Tamper', withType: true,
        },{
          title: $localize`Tilt`, value: 'Tilt', withType: true,
        },{
          title: $localize`Glass break`, value: 'Glass break', withType: true,
        }],
      }, {
        key: 'Digital output 0/3 V', title: $localize`Digital output 0/3 V`, options: [{
          title: $localize`Switch`,value: 'switch', withType: true,
        }, {
          title: $localize`Door lock`, value: 'doorLock', withType: true,
        }, {
          title: $localize`Siren`, value: 'siren', withType: true,
        }, {
          title: $localize`Valve`, value: 'valve', withType: true,
        }, {
          title: $localize`Heating thermostat`, value: 'heatingThermostat', withType: true, additionally: [{
            title: $localize`Z-Wave temp sensor`, value: 'Z-Wave temp sensor',
          }, {
            title: $localize`DS18B20`, value: 'DS18B20',
          }],
        }, {
          title: $localize`Cooling thermostat`, value: 'coolingThermostat', withType: true, additionally: [{
            title: $localize`Z-Wave temp sensor`, value: 'Z-Wave temp sensor',
          }, {
            title: $localize`DS18B20`, value: 'DS18B20',
          }],
        }],
      }],
    }]

  constructor(
    private readonly pinSelectedService: PinSelectedService,
    ) {
  }

  public select(container: PinContainer): void {
    this.pinSelectedService.select(container);
  }
}
