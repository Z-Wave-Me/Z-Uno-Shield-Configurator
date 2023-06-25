const codeTemplates = {
  'SwitchBinary': {
    'note':     'PPP5PPP',
    'vars':     'byte pinXXXSwitchBinaryState = 0;',
    'channel':  '  PPP1PPP(pinXXXSwitchBinaryState, NULL)',
    'setup':    '  pinMode(XXX, OUTPUT);',
    'loop':     '  // GPIOSwitchBinary@pinXXX process code\n'
      +'  digitalWrite(XXX, pinXXXSwitchBinaryState ? PPP3PPP : PPP4PPP);',
    'xetter':   '',
    'preAction': function(params, pin) {
      switch(params[1]) {
        case 'switch':
          params[1] = 'ZUNO_SWITCH_BINARY';
          break;
        case 'doorlock':
          params[1] = 'ZUNO_DOORLOCK';
          break;
        case 'siren':
          params[1] = 'ZUNO_SIREN';
          break;
        case 'valve':
          params[1] = 'ZUNO_FLOWSTOP';
          break;
      }
      params[3] = params[2] == 'normal' ? 'HIGH' : 'LOW';
      params[4] = params[2] == 'normal' ? 'LOW' : 'HIGH';
      params[5] = [13, 14, 15, 16].indexOf(pin) !== -1 ? '- Make sure that output current do not exceed 5 A per channel or 15 A per all PWM1-4 pins' : '';

      return params;
    },
    'retemplate': function(params) {
      if (params[1] === 'heatingThermostat' || params[1] === 'coolingThermostat') {return 'Thermostat'}

      return;
    },
  },
  'Thermostat': {
    'note':     '- PPP10PPP',
    'vars':     'byte pinXXXThermostatModeState = 0;\n'
      + 'int pinXXXThermostatTemperatureState = 0;\n'
      + 'int pinXXXThermostatTemperatureCurrent = 0;',
    'channel':  '  ZUNO_THERMOSTAT(THERMOSTAT_FLAGS_OFF | THERMOSTAT_FLAGS_PPP5PPP, THERMOSTAT_UNITS_CELSIUS, THERMOSTAT_RANGE_POS, 4, pinXXXThermostatModeGetter, pinXXXThermostatModeSetter, pinXXXThermostatTemperatureGetter, pinXXXThermostatTemperatureSetter)',
    'report':   '  // External temperature sensor for thermostat @pinXXX processing\n'
      +'  if ( REPORT_SENSOR_MULTILEVEL_TYPE(report) == ZUNO_SENSOR_MULTILEVEL_TYPE_TEMPERATURE) {\n'
      + '    int temp = int(REPORT_SENSOR_MULTILEVEL_VALUE(report) * 10);\n'
      + '    if (REPORT_SENSOR_MULTILEVEL_SCALE(report) != SENSOR_MULTILEVEL_SCALE_CELSIUS) {\n'
      + '      // Conversion from degrees Fahrenheit to degrees Celsius\n'
      +'      temp = (temp - 32) * 5 / 9;\n'
      + '    }\n'
      + '    pinXXXThermostatTemperatureCurrent = temp;\n'
      + '  }',
    'setup':    '  pinMode(XXX, OUTPUT);',
    'loop':     '  // Thermostat@pinXXX process code\n'
      +'  if (pinXXXThermostatModeState) {PPP7PPP\n'
      + '    if (pinXXXThermostatTemperatureState < pinXXXThermostatTemperatureCurrent - PPP6PPP) {\n'
      + '      digitalWrite(XXX, PPP8PPP);\n'
      + '    }\n'
      + '    if (pinXXXThermostatTemperatureState > pinXXXThermostatTemperatureCurrent + PPP6PPP) {\n'
      + '      digitalWrite(XXX, PPP9PPP);\n'
      + '    }\n'
      + '  }',
    'xetter':   'void pinXXXThermostatModeSetter(byte value) {\n'
      + '  pinXXXThermostatModeState = value;\n'
      + '}\n\n'
      + 'byte pinXXXThermostatModeGetter() {\n'
      + '  return pinXXXThermostatModeState;\n'
      + '}\n\n'
      + 'void pinXXXThermostatTemperatureSetter(byte mode, signed int value) {\n'
      + '  pinXXXThermostatTemperatureState = value;\n'
      + '}\n\n'
      + 'signed int pinXXXThermostatTemperatureGetter(byte mode) {\n'
      + '  return pinXXXThermostatTemperatureState;\n'
      + '}',
    'preAction': function(params, pin, pins) {
      params[5] = params[1] === 'heatingThermostat' ? 'HEAT' : 'COOL'
      params[8] = ((params[2] === 'normal') !== (params[1] === 'coolingThermostat')) ? 'HIGH' : 'LOW';
      params[9] = ((params[2] === 'normal') !== (params[1] === 'coolingThermostat'))? 'LOW' : 'HIGH';
      params[6] = 10; // 1 deg C

      const thermostatExternalSensorPins = Object.keys(pins).filter(function(key) {
        return pins[key].type === 'SwitchBinary' && (pins[key].params[1] === 'heatingThermostat' || pins[key].params[1] === 'coolingThermostat') && pins[key].params[3] === 'external';
      });

      if (params[3] === 'external') {
        params[7] = '';

        if (thermostatExternalSensorPins[0] === pin) {
          params[10] = 'Put Z-Uno in the Life Line association group of a temperature sensor. Make sure both devices share same security scheme';
        } else {
          params.suppressNote = true;
        }
      } else {
        const ds18b20Num = parseInt(params[3].split('ds18b20_')[1]);
        params[7] = '\n    pinXXXThermostatTemperatureCurrent = temperature[' + (ds18b20Num - 1) + ']/10;'
        params[10] = 'You need to set up DS18B20 channel with at least ' + ds18b20Num + ' sensor' + (ds18b20Num > 1 ? 's' : '') + '.';
        params.suppressReport = true;
      }

      return params;
    },
  },
  'SwitchMultilevelPWM0': {
    'note':     '',
    'vars':     'byte pinXXXSwitchMultilevelState = 0, _pinXXXSwitchMultilevelState = 1;',
    'channel':  '  ZUNO_SWITCH_MULTILEVEL(pinXXXSwitchMultilevelState, NULL)',
    'setup':    '',
    'loop':     '  // 0-10V SwitchMultilevel@pinXXX process code\n'
      +'  if (pinXXXSwitchMultilevelState != _pinXXXSwitchMultilevelState) {\n'
      + '    _pinXXXSwitchMultilevelState = pinXXXSwitchMultilevelState;\n'
      + '    shield.write0_10V(PPP2PPP, pinXXXSwitchMultilevelState);\n'
      + '  }',
    'preAction': function(params, pin, pins){
      params[2] = 0; //  (!) Fix it to right channel, pin is virtual number pin 
      params.enable0_10V = true;

      return params;
    },
    'xetter':   '',
  },
  'SwitchMultilevel': {
    'note':     '- Make sure that output current do not exceed 5 A per channel or 15 A per all PWM1-4 pins',
    'vars':     'byte pinXXXSwitchMultilevelState = 0;',
    'channel':  '  ZUNO_SWITCH_MULTILEVEL(pinXXXSwitchMultilevelState, NULL)',
    'setup':    '',
    'loop':     '  // PWM SwitchMultilevel@pinXXX process code\n'
      +'  shield.writePWMPercentage(PPP3PPP, pinXXXSwitchMultilevelState);',
    'xetter':   '',
    'pwm_map': 'PPP2PPP',
    'preAction': function(params, pin, pins){
      params[3] = (pin - 13);
      params[2] = ''+1 << (params[3]);

      return params;
    },
    'retemplate': function(params) {
      if (params[1] !== 'single') {return 'SwitchColor';}

      return;
    },
  },
  'SwitchColor': {
    'note':     '- Make sure that output current do not exceed 5 A per channel or 15 A per all PWM1-4 pins',
    'vars':     'byte pinXXXSwitchMultilevelState = 0;',
    'channel':  '  ZUNO_SWITCH_COLOR(PPP2PPP, pinsSwitchColorGetter, pinsSwitchColorSetter)',
    'setup':    '  pinMode(XXX, OUTPUT);',
    'loop':     '  // PWM SwitchColor@pinXXXprocess code\n'
      +'  analogWriteResolution(8); analogWrite(XXX, pinXXXSwitchMultilevelState);',
    'xetter':   'void pinsSwitchColorSetter(byte color, byte value) {\n'
      + 'PPP3PPP\n'
      + '}\n\n'
      + 'byte pinsSwitchColorGetter(byte color) {\n'
      + 'PPP4PPP\n'
      + '}',
    'preAction': function(params, pin, pins) {

      const colorFlags =  {
        'white': 'SWITCH_COLOR_FLAGS_WARM_WHITE',
        'red': 'SWITCH_COLOR_FLAGS_RED',
        'green': 'SWITCH_COLOR_FLAGS_GREEN',
        'blue': 'SWITCH_COLOR_FLAGS_BLUE',
      };

      const colorModes =  {
        'white': 'SWITCH_COLOR_COMPONENT_WARM_WHITE',
        'red': 'SWITCH_COLOR_COMPONENT_RED',
        'green': 'SWITCH_COLOR_COMPONENT_GREEN',
        'blue': 'SWITCH_COLOR_COMPONENT_BLUE',
      };

      const colorChannels = Object.keys(pins).map(function(key) {
        return (pins[key].type === 'SwitchMultilevel' && pins[key].params[1] != 'single') ? { key: key, obj: pins[key]} : null;
      }).filter(function(x) { return x; });

      const colors = colorChannels.map(function(x) { return x.obj.params[1]; });

      const colorsFlags = colors.map(function(x) { return colorFlags[x]; });

      if (params[1] === colors[0]) {
        params[2] = colorsFlags.join(' | ');
        params[3] = colorChannels.map(function(x) { return '  if (color == ' + colorModes[x.obj.params[1]] + ') pin' + x.key + 'SwitchMultilevelState = value;'; }).join('\n');
        params[4] = colorChannels.map(function(x) { return '  if (color == ' + colorModes[x.obj.params[1]] + ') return pin' + x.key + 'SwitchMultilevelState;'; }).join('\n');
      } else {
        params.channels = 0;
        params.suppressChannel = true;
        params.suppressXetter = true;
      }

      return params;
    },
  },
  'SensorBinary': {
    'note':     'PPP5PPP',
    'vars':     'byte pinXXXSensorBinaryState;',
    'channel':  '  ZUNO_SENSOR_BINARY(PPP1PPP, pinXXXSensorBinaryState)',
    'setup':    '  pinMode(XXX, PPP4PPP);\n  pinXXXSensorBinaryState = PPP2PPP!digitalRead(XXX);',
    'loop':     '  // GPIO SensorBinary@pinXXX process code\n'
      +'  byte _pinXXXSensorBinaryState = PPP2PPPdigitalRead(XXX);\n'
      + '  if (pinXXXSensorBinaryState != _pinXXXSensorBinaryState) {\n'
      + '    pinXXXSensorBinaryState = _pinXXXSensorBinaryState;\n'
      + '    zunoSendReport(NNN);\n'
      + '  }',
    'xetter':   '',
    'preAction': function(params) {
      params[1] = {
        'general': 'ZUNO_SENSOR_BINARY_TYPE_GENERAL_PURPOSE',
        'smoke': 'ZUNO_SENSOR_BINARY_TYPE_SMOKE',
        'co': 'ZUNO_SENSOR_BINARY_TYPE_CO',
        'co2': 'ZUNO_SENSOR_BINARY_TYPE_CO2',
        'heat': 'ZUNO_SENSOR_BINARY_TYPE_HEAT',
        'leakage': 'ZUNO_SENSOR_BINARY_TYPE_WATER',
        'freeze': 'ZUNO_SENSOR_BINARY_TYPE_FREEZE',
        'tamper': 'ZUNO_SENSOR_BINARY_TYPE_TAMPER',
        'door': 'ZUNO_SENSOR_BINARY_TYPE_DOOR_WINDOW',
        'tilt': 'ZUNO_SENSOR_BINARY_TYPE_TILT',
        'motion': 'ZUNO_SENSOR_BINARY_TYPE_MOTION',
        'glassbr': 'ZUNO_SENSOR_BINARY_TYPE_GLASSBREAK',
      }[params[1]];

      params[2] = params[2] === 'normal' ? '' : '!';
      params[4] = params[3] === 'pullup' ? 'INPUT_PULLUP' : 'INPUT';
      params[5] = params[3] === 'pullup' ? '' : '- Make sure that input is always pulled to high or low level.'

      return params;
    },
  },
  'SensorMultilevel': {
    'note':     '- Reports are sent every 30 seconds',
    'vars':     'PPP5PPP pinXXXSensorMultilevelState=0, _pinXXXSensorMultilevelState=1; ',
    'channel':  '  ZUNO_SENSOR_MULTILEVEL(PPP4PPP, pinXXXSensorMultilevelState)',
    'setup':    '  shield.initADCChannel(PPP6PPP, PPP7PPP);',
    'loop':     '  // ADC SensorMultilevel@pinXXX process code\n'
      +'  pinXXXSensorMultilevelState = (PPP5PPP) round(PPP1PPP * shield.readADCVoltage(PPP6PPP) + PPP3PPP);\n'
      + '  if(pinXXXSensorMultilevelState != _pinXXXSensorMultilevelState){\n'
      +'    _pinXXXSensorMultilevelState = pinXXXSensorMultilevelState;\n'
      +'    zunoSendReport(NNN); // report if value has changed\n'
      +'  }',

    'xetter':   '',
    'preAction': function(params, pin) {
      const precision = {
        'percentage': 0,
        'temperature': 1,
        'luminance': 0,
        'ppm': 0,
        'humidity': 1,
        'voltage': 1,
        'current': 1,
        'distance': 1,
        'pressure': 2,
      }[params[4]];

      const precision_str = {
        0: 'SENSOR_MULTILEVEL_PRECISION_ZERO_DECIMALS',
        1: 'SENSOR_MULTILEVEL_PRECISION_ONE_DECIMAL',
        2: 'SENSOR_MULTILEVEL_PRECISION_TWO_DECIMALS',
      }[precision];

      const size = {
        'percentage': 1,
        'temperature': 2,
        'luminance': 2,
        'humidity': 1,
        'voltage': 2,
        'current': 2,
        'distance': 2,
        'pressure': 4,
        'ppm': 2,
      }[params[4]];

      const voltage_offset = {
        '3': 3.0,
        '5': 5.0,
        '12': 12.0,
      }[params[5]];

      const size_str = {
        1: 'SENSOR_MULTILEVEL_SIZE_ONE_BYTE',
        2: 'SENSOR_MULTILEVEL_SIZE_TWO_BYTES',
        4: 'SENSOR_MULTILEVEL_SIZE_FOUR_BYTES',
      }[size];

      const m = params[1] * Math.pow(10, precision), M = params[2] * Math.pow(10, precision);
      //var frac = floatToRatio((M - m) / voltage_offset, 64);
      params[1] = ((M-m)/voltage_offset).toFixed(5);
      params[2] = 0;
      params[3] = (m).toFixed(5);
      params[6] = pin +'-A0';
      params[7] =  {
        '3': 'SHIELD_ADC_JUMPER_IO3V',
        '5': 'SHIELD_ADC_JUMPER_I5V',
        '12': 'SHIELD_ADC_JUMPER_I12V',
      }[params[5]];

      params[4] = {
        'percentage': 'ZUNO_SENSOR_MULTILEVEL_TYPE_GENERAL_PURPOSE_VALUE, SENSOR_MULTILEVEL_SCALE_PERCENTAGE_VALUE, ' + size_str + ', ' + precision_str,
        'temperature': 'ZUNO_SENSOR_MULTILEVEL_TYPE_TEMPERATURE, SENSOR_MULTILEVEL_SCALE_CELSIUS, ' + size_str + ', ' + precision_str,
        'luminance': 'ZUNO_SENSOR_MULTILEVEL_TYPE_LUMINANCE, SENSOR_MULTILEVEL_SCALE_PERCENTAGE_VALUE, ' + size_str + ', ' + precision_str,
        'humidity': 'ZUNO_SENSOR_MULTILEVEL_TYPE_RELATIVE_HUMIDITY, SENSOR_MULTILEVEL_SCALE_PERCENTAGE_VALUE, ' + size_str + ', ' + precision_str,
        'voltage': 'ZUNO_SENSOR_MULTILEVEL_TYPE_VOLTAGE, SENSOR_MULTILEVEL_SCALE_VOLT, ' + size_str + ', ' + precision_str,
        'current': 'ZUNO_SENSOR_MULTILEVEL_TYPE_CURRENT, SENSOR_MULTILEVEL_SCALE_AMPERE, ' + size_str + ', ' + precision_str,
        'distance': 'ZUNO_SENSOR_MULTILEVEL_TYPE_DISTANCE, SENSOR_MULTILEVEL_SCALE_METER, ' + size_str + ', ' + precision_str,
        'pressure': 'ZUNO_SENSOR_MULTILEVEL_TYPE_ATMOSPHERIC_PRESSURE, SENSOR_MULTILEVEL_SCALE_KILO_PASCAL, ' + size_str + ', ' + precision_str,
        'ppm': 'ZUNO_SENSOR_MULTILEVEL_TYPE_CO2_LEVEL, SENSOR_MULTILEVEL_SCALE_PARTS_PER_MILLION, ' + size_str + ', ' + precision_str,
      }[params[4]];

      params[5] = {
        1: 'byte',
        2: 'word',
        4: 'dword',
      }[size];

      return params;
    },
  },
  'DHT': {
    'note':     '- Connect PPP1PPP sensor.',
    'includes': '#include "ZUNO_DHT.h"',
    'vars':     'DHT pinXXXDHT(XXX, PPP1PPP);\n'
      + '\n'
      + 'int pinXXXDHTTemperatureState;\n'
      + 'word pinXXXDHTHumidityState;',
    'channel':  '  ZUNO_SENSOR_MULTILEVEL(ZUNO_SENSOR_MULTILEVEL_TYPE_TEMPERATURE, SENSOR_MULTILEVEL_SCALE_CELSIUS, SENSOR_MULTILEVEL_SIZE_TWO_BYTES, SENSOR_MULTILEVEL_PRECISION_ONE_DECIMAL, pinXXXDHTTemperatureState),\n'
      + '  ZUNO_SENSOR_MULTILEVEL(ZUNO_SENSOR_MULTILEVEL_TYPE_RELATIVE_HUMIDITY, SENSOR_MULTILEVEL_SCALE_PERCENTAGE_VALUE, SENSOR_MULTILEVEL_SIZE_TWO_BYTES, SENSOR_MULTILEVEL_PRECISION_ONE_DECIMAL, pinXXXDHTHumidityState)',
    'setup':    '  pinXXXDHT.begin();',
    'loop':     '  // DHT sensor (@pinXXX) read procedure\n'
      +'  int _pinXXXDHTTemperatureState = pinXXXDHT.readTemperatureC10();\n'
      + '  word _pinXXXDHTHumidityState = pinXXXDHT.readHumidityH10();\n'
      + '  if(abs(_pinXXXDHTTemperatureState-pinXXXDHTTemperatureState) > 2) {\n'
      +'    // the temperature has changed by at least 0.2*C\n'
      +'    pinXXXDHTTemperatureState = _pinXXXDHTTemperatureState;\n'
      +'    zunoSendReport(NNN);\n'
      +'  }\n'
      + '  if(abs(_pinXXXDHTHumidityState-pinXXXDHTHumidityState) > 10) {\n'
      +'    // the humidity has changed by at least 1%\n'
      +'    pinXXXDHTHumidityState = _pinXXXDHTHumidityState;\n'
      +'    zunoSendReport(NNN +1);\n'
      +'  }\n',
    'xetter':   '',
    'preAction': function(params) {
      params.channels = 2;

      return params;
    },
  },
  'DS18B20': {
    'note':     '- Connect PPP1PPP DS18B20 sensors.',
    'includes': '#include "ZUNO_DS18B20.h"',
    'vars':     'OneWire ow(XXX);\n'
      + 'DS18B20Sensor ds18b20(&ow);\n'
      + '\n'
      + 'byte addresses[8 * (PPP1PPP + 1)]; // last one for search\n'
      + 'byte number_of_sensors; // Number of sensors found (if less than PPP1PPP connected)\n'
      + 'int temperature[PPP1PPP];',
    'channel':  'PPP2PPP',
    'setup':    '  number_of_sensors = ds18b20.findAllSensors(addresses, PPP1PPP);',
    'loop':     '  // DS18B20 sensors (@pinXXX) poll\n'
      +'  for(int ds_sen_i=0;ds_sen_i<number_of_sensors;ds_sen_i++){\n'
      +'    int current_temp = ds18b20.getTempC100(&addresses[ds_sen_i << 3]);\n'
      +'    if(abs(current_temp - temperature[ds_sen_i]) >= 10){ \n'
      +'      // the temperature has changed by at least 0.1*C\n'
      +'      temperature[ds_sen_i] = current_temp;\n'
      +'      zunoSendReport(NNN+ds_sen_i);\n'
      +'    }\n'
      +'  }',
    'xetter':   '',
    'preAction': function(params) {
      params.channels = parseInt(params[1]);
      const chDefs = [];

      for (let n = 0; n < params.channels; n++) {
        chDefs.push('  ZUNO_SENSOR_MULTILEVEL(ZUNO_SENSOR_MULTILEVEL_TYPE_TEMPERATURE, SENSOR_MULTILEVEL_SCALE_CELSIUS, SENSOR_MULTILEVEL_SIZE_TWO_BYTES, SENSOR_MULTILEVEL_PRECISION_TWO_DECIMALS, temperature)');
      }

      params[2] = chDefs.join(',\n');
      params[3] = '  for(int ds_sen_i=0;ds_sen_i<number_of_sensors;ds_sen_i){\n    int current_temp = ds18b20.getTempC100(&addresses[ds_sen_i << 3]);\n    if(current_temp != temperature[ds_sen_i]){\n      temperature[ds_sen_i]=current_temp;\n      zunoSendReport(NNN+ds_sen_i);\n    }\n  }'

      return params;
    },
  },
  'UART': {
    'note':     '- No channel is created for UART - define a channel if needed and write the code to send and parse commands.',
    'vars':     '',
    'channel':  '',
    'setup':    '  Serial1.begin(PPP1PPP);',
    'loop':     '',
    'funcs':    'char readByteUART() {\n'
      + '  while(Serial1.available() <= 0) delay(1);\n'
      + '  return Serial1.read();\n'
      + '}\n'
      + '\n'
      + 'void writeUART(char b) {\n'
      + '  Serial1.write(b);\n'
      + '}',
    'xetter':   '',
    'preAction': function(params, pin) {
      params.channels = 0;

      if (pin === '8') {params.suppressSetup = params.suppressFuncs = true;}

      return params;
    },
  },
  'RS485': {
    'note':     '- No channel is created for RS485 - define a channel if needed and write the code to send and parse commands.\n'
      + '- Pin 2 is also occupied by RS485.',
    'vars':     '',
    'channel':  '',
    'setup':    '  Serial1.begin(PPP1PPP);\n'
      + '  pinMode(2, OUTPUT);\n'
      + '  digitalWrite(2, LOW);',
    'loop':     '',
    'funcs':    'char readByteRS485() {\n'
      + '  while(Serial1.available() <= 0) delay(1);\n'
      + '  return Serial1.read();\n'
      + '}\n'
      + '\n'
      + 'void writeRS485(char b) {\n'
      + '  digitalWrite(2, HIGH);\n'
      + '  delay(5);\n'
      + '  Serial1.write(b);\n'
      + '  delay(5);\n'
      + '  digitalWrite(2, LOW);\n'
      + '}',
    'xetter':   '',
    'preAction': function(params, pin) {
      params.channels = 0;

      if (pin === '8') {params.suppressSetup = params.suppressFuncs = true;}

      return params;
    },
  },
};

function detemplate(template, key, channelNum, assocNum, params) {
  if (!template) {return template;}

  Object.keys(params).map(function(paramName) { if (parseInt(paramName)) {template = template.replace(new RegExp('PPP' + paramName + 'PPP', 'g'), params[paramName]);} });

  return template.replace(/XXX/g, key).replace(/NNN/g, channelNum).replace(/AAA/g, assocNum);
}

function pinsToTemplates(pins) {
  const templates = [];

  let channelNum = 1;
  let assocNum = 1;
  Object.keys(pins).map(function(key) {
    if (pins[key].type === 'NC') {return;} // no channel

    let templ = codeTemplates[pins[key].type];

    if (!templ) {
      // alert("Can not find code template for " + pins[key].type);
      console.log('Can not find code template for ' + pins[key].type);

      return;
    }

    let params = clone(pins[key].params);

    if (templ.retemplate) {
      const templName = templ.retemplate(params, pins); // change template if needed

      if (templName) {templ = codeTemplates[templName];}
    }

    if (templ.preAction) {params = templ.preAction(params, key, pins);} // apply pre action on params

    console.log(params);
    templates.push({
      'note': !params.suppressNote && detemplate(templ.note, key, channelNum, assocNum, params),
      'includes': !params.suppressIncludes && detemplate(templ.includes, key, channelNum, assocNum, params),
      'vars': !params.suppressVars && detemplate(templ.vars, key, channelNum, assocNum, params),
      'channel': !params.suppressChannel && detemplate(templ.channel, key, channelNum, assocNum, params),
      'report': !params.suppressReport && detemplate(templ.report, key, channelNum, assocNum, params),
      'setup': !params.suppressSetup && detemplate(templ.setup, key, channelNum, assocNum, params),
      'loop': !params.suppressLoop && detemplate(templ.loop, key, channelNum, assocNum, params),
      'xetter': !params.suppressXetter && detemplate(templ.xetter, key, channelNum, assocNum, params),
      'funcs': !params.suppressFuncs && detemplate(templ.funcs, key, channelNum, assocNum, params),
      'pwm_map': (templ.pwm_map != undefined) ? detemplate(templ.pwm_map, key, channelNum, assocNum, params) : '',
      'enable0_10V': params.enable0_10V ? params.enable0_10V : false,
      'key': key,
    });

    channelNum += params.channels !== undefined ? params.channels : 1;
    assocNum += params.assocs !== undefined ? params.assocs : 0;
  });

  return templates;
}

function clone(obj) {
  const copy = {};

  for (const prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      copy[prop] = obj[prop];
    }
  }

  return copy;
}

function floatToRatio(x, maxNumerator) {
  const tolerance = 1.0E-6;
  let h1 = 1, h2 = 0;
  let k1 = 0, k2 = 1;
  let b = Math.abs(x);

  do {
    const a = Math.floor(b);
    let aux = h1;

    if (a*h1+h2 >= maxNumerator) {break;}

    h1 = a * h1 + h2;
    h2 = aux;
    aux = k1;
    k1 = a * k1 + k2;
    k2 = aux;
    b = 1 / (b - a);
  } while (Math.abs(x - h1 / k1) > x * tolerance);

  return [h1 * Math.sign(x), k1];
}

function generateCode(pins) {
  // исправление множественного вызова
  if (!pins.isReadyToCode) {return;}

  const templates = pinsToTemplates(pins),
    _relation = templatesToRelations(templates),
    used_pins = [];

  // Собираем используемые в связях пины
  if (_relation) {Object.keys(_relation).map(function(i){ used_pins.push(_relation[i].device_sb.pin); });}

  const includes = templates.map(function(ch) { return ch.includes; }).filter(function(value, index, self) { return self.indexOf(value) === index && !!value; }).join('\n');
  const vars = templates.map(function(ch) { return ch.vars; } ).filter(function(value) { return !!value; }).join('\n');
  const channels = templates.map(function(ch) { return ch.channel; } ).filter(function(value) { return !!value; }).join(',\n');
  const reports = templates.map(function(ch) { return ch.report; } ).filter(function(value) { return !!value; }).join(',\n');
  const setup = templates.map(function(ch) { return ch.setup; } ).filter(function(value) { return !!value; }).join('\n');
  // убираем кусок, если устройство уже используется в связях (предполгается, что в лупе только запись значения на пин)
  const loop = templates.map(function(ch) { if (!used_pins.includes(ch.key)) {return ch.loop;}} ).filter(function(value) { return !!value; }).join('\n\n') + '\n';
  const xetter = templates.map(function(ch) { return ch.xetter; } ).filter(function(value) { return !!value; }).join('\n\n');
  const funcs = templates.map(function(ch) { return ch.funcs; } ).filter(function(value) { return !!value; }).join('\n\n');
  const notes = templates.map(function(ch) { return ch.note; } ).filter(function(value) { return !!value; }).join('\n\n');
  const keys = templates.map(function(ch) { if (ch.note) {return ch.key;} } ).filter(function(value) { return !!value; }).join(',');
  const pwm_map = templates.map(function(ch) { return ch.pwm_map; } ).filter(function(value) { return !!value; }).join('|');
  const enable0_10V = templates.reduce(function(prev, ch) {
    if (typeof prev != 'boolean') {// variable is a boolean 
      prev = (prev.enable0_10V == true)
    }

  return (prev) || (ch.enable0_10V == true) ; 
} )
  const rloop = _relation ? ('  // Logical relations code\n' + relations2code(_relation).map(function(ch) { return ch.rloop }).join('\n\n') +  '\n\n') : '';

  if (!includes && !vars && !channels && !setup && !loop && !xetter && !notes && !funcs) {
return {
      'code': '// Please select features',
      'notes': 'No notes',
    };
}
  // if (!loop.match(/\S/gm)) loop = '';
  // if (!rloop.match(/\S/gm)) rloop = '';
  // if channel are empty setup_channels will be hidden
  // if (channels.match(/\S/gm)) channels = "// Z-Wave channels\n" + " ZUNO_SETUP_CHANNELS(\n" + channels + "\n);\n\n";

  return {
    'code':
      '\n#include "ZUNO_SHIELD.h" // Shield library'+ '\n\n'
      + (includes ? (includes + '\n\n') : '')
      + (vars ? ('// Global variables\n' + vars + '\n\n' ) : '')
      + (channels ? ('// Z-Wave channels\n' + 'ZUNO_SETUP_CHANNELS(\n' + channels + '\n);\n\n'): '')
      + (reports ? ('// External SensorMultilevel reports handler \nZUNO_REPORTS_HANDLER(SensorMultilevel, reportSMLHandler);\n\n') : '')
      + 'ZUNOShield shield; // Shield object'+ '\n\n'
      + 'void setup() {\n'
      + (enable0_10V ? '  shield.init0_10V();\n' : '')
      + (pwm_map ? '  shield.initPWM('+pwm_map+');\n' :'')
      +setup + '\n'
      + '}\n\n'
      + 'void loop() {\n'
      + loop
      + rloop
      + '}\n\n'
      + (xetter ? ('// Getters and setters\n' + xetter + '\n\n') : '')
      + (reports ? ('void reportSMLHandler(ReportAuxData_t * report) {\n' + reports + '\n}' + '\n\n') : '')
      + (funcs ? ('\n\n// Functions\n' + funcs + '\n\n') : ''),
    'notes': notes ? notes : 'No notes',
    'keys': keys ? keys : 'No keys',
  };
}

function templatesToRelations(templates) {
  const cvars = {},
    relation = htmlCEl('relation'),
    _relation = {};

  if (relation.length) {
    templates.map(function(ch) {
      cvars[ch.key] = [];
      const regex = /pin.[a-zA-Z0-9]+/gm;

      while ((m = regex.exec(ch.vars)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {regex.lastIndex++;}

        // The result can be accessed through the `m`-variable.
        m.forEach((match, groupIndex) => {
          cvars[ch.key].push(match);
        });
      }
    });

    for (i = 0; i < relation.length; i++) {
      // update relelems obj
      findRelationEl(relation[i]);
      const sensor_pin = extractPinFromOption(relelems.sensor.select),
        device_pin = extractPinFromOption(relelems.device.select);

      _relation[i] = {
        'sensor_sb': {
          'value': relelems.sensor.select.value,
          'vars': cvars[sensor_pin],
          'pin': sensor_pin,
        },
        'device_sb': {
          'value': relelems.device.select.value,
          'vars': cvars[device_pin],
          'pin': device_pin,
        },
        'dht': relelems.dht.select.value,
        'ds18b20': relelems.ds18b20.select.value,
        'condition_sb': relelems.condition.select.value,
        'mode_sb': relelems.mode.select.value,
        'condition_input': relelems.condition.input.value,
        'swmul_input': relelems.device.input.value,
        'el': relation[i],
        'disabled': true,
        'length': i,
      }
    }

    if (checkRelationsCorectness(_relation)) {return _relation;}
  }

  return;
}


function extractPinFromOption(sb) {
  const text = sb.options[sb.selectedIndex].text;
  try {
    return text.match(/\[\d+\]/g)[0].replace(/(^.*\[|\].*$)/g, '');
  } catch (e) {
    return null;
  }
}


function relations2code(_relation) {
  const r_templates = [];

  Object.keys(_relation).map(function(index) {
    const __relation = _relation[index];

    // uncompleted relation
    if (__relation.disabled) {
      console.log('*** (!)Relation incomplete type: ' + __relation.sensor_sb.value + ' device type: ' + __relation.device_sb.value);

      return;
    }

    // rebuild relation with specific types 
    switch(true) {
      // DS18B20            
      case __relation.sensor_sb.value === 'DS18B20':
        __relation.sensor_sb.vars = ['temperature[' + (__relation.ds18b20 - 1) + ']'];
        __relation.sensor_sb.value = 'SensorMultilevel';
        break;
      // DHT            
      case __relation.sensor_sb.value === 'DHT':
        if (__relation.dht === 'temperature') {__relation.sensor_sb.vars = [__relation.sensor_sb.vars[1]];} //"pin12DHTTemperatureState"
        else {__relation.sensor_sb.vars = [__relation.sensor_sb.vars[2]];} //"pin12DHTHumidityState"

        __relation.sensor_sb.value = 'SensorMultilevel';
        break;
      // 0-10V
      case __relation.device_sb.value === 'SwitchMultilevelPWM0':
        __relation.device_sb.value = 'SwitchMultilevel';
        break;
    }

    const r_templ = relationCodeTemplates[__relation.sensor_sb.value + '_' + __relation.device_sb.value];

    if (!r_templ) {
      console.log('*** Can not find relation code template for this.\nS: ' + __relation.sensor_sb.value + '\nD: ' + __relation.device_sb.value);

      return;
    }

    r_params = r_templ.preAction(__relation);
    console.log('*** Relation sensor type: ' + __relation.sensor_sb.value + ' device type: ' + __relation.device_sb.value);

    r_templates.push({
      'rloop': reldetemplate(r_templ.rloop, __relation, r_params),
    });
  });

  return r_templates;
}

function reldetemplate(r_templ, __relation, r_params) {
  if (!r_templ) {return r_templ;}

  if (r_params) {r_params.map(function(value, index) { r_templ = r_templ.replace(new RegExp('PPP' + index + 'PPP', 'g'), value); })}

  return r_templ.replace(/SSS/g, __relation.sensor_sb.vars[0]).replace(/DDD/g, __relation.device_sb.vars[0]).replace(/SXSXSX/g, __relation.sensor_sb.pin).replace(/DXDXDX/g, __relation.device_sb.pin);
}

var r_params = [];
var relationCodeTemplates = {
  'SensorBinary_SwitchBinary': {
    // s - sensor, m - mode,
    'rloop':'  if (SSS == PPP1PPP) {\n'
      + '    DDD = PPP3PPP;\n'
      + '    digitalWrite(DXDXDX, DDD);\n'
      + '  }',
    'preAction': function(rel) {
      r_params[1] = rel.condition_sb;
      r_params[2] = rel.condition_sb == '0xFF' ? '0x00' : '0xFF';
      r_params[3] = rel.mode_sb;

      return r_params;
    },
  },
  'SensorMultilevel_SwitchBinary': {
    // sensor condition value
    'rloop':'  if (SSS PPP1PPP PPP2PPP) {\n'
      + '    DDD = PPP3PPP;\n'
      + '    digitalWrite(DXDXDX, DDD);\n'
      + '  }',
    'preAction': function(rel) {
      r_params[1] = rel.condition_sb;
      r_params[2] = rel.condition_input;
      r_params[3] = rel.mode_sb;

      return r_params;
    },
  },
  'SensorBinary_SwitchMultilevel': {
    'rloop':'  if (SSS == PPP1PPP) {\n'
      + '    DDD = PPP3PPP;\n'
      + '    analogWrite(DXDXDX, (word)DDD * 255 / 99);\n'
      + '  }',
    'preAction': function(rel) {
      r_params[1] = rel.condition_sb;
      r_params[2] = rel.condition_sb == '0xFF' ? '0x00' : '0xFF';
      r_params[3] = rel.swmul_input;

      return r_params;
    },
  },
  'SensorMultilevel_SwitchMultilevel': {
    'rloop':'  if (SSS PPP1PPP PPP2PPP) {\n'
      + '    DDD = PPP3PPP;\n'
      + '    analogWrite(DXDXDX, (word)DDD * 255 / 99);\n'
      + '  }',
    'preAction': function(rel) {
      r_params[1] = rel.condition_sb;
      r_params[2] = rel.condition_input;
      r_params[3] = rel.swmul_input;

      return r_params;
    },
  },
}
