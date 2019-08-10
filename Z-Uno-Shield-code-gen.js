var codeTemplates = {
    "SwitchBinary": {
        "note":     "PPP5PPP",
        "vars":     "byte pinXXXSwitchBinaryState = 0;",
        "channel":  "  PPP1PPP(pinXXXSwitchBinaryGetter, pinXXXSwitchBinarySetter)",
        "setup":    "  pinMode(XXX, OUTPUT);",
        "loop":     "  digitalWrite(XXX, pinXXXSwitchBinaryState ? PPP3PPP : PPP4PPP);",
        "xetter":   "void pinXXXSwitchBinarySetter(byte value) {\n" +
                    "  pinXXXSwitchBinaryState = value;\n" +
                    "}\n\n" +
                    "byte pinXXXSwitchBinaryGetter() {\n" +
                    "  return pinXXXSwitchBinaryState;\n" +
                    "}",
        "preAction": function(params, pin) {
            switch(params[1]) { 
              case "switch":
                params[1] = "ZUNO_SWITCH_BINARY";
                break;
              case "doorlock":
                params[1] = "ZUNO_DOORLOCK";
                break;
              case "siren":
                params[1] = "ZUNO_SIREN";
                break;              
              case "valve":
                params[1] = "ZUNO_FLOWSTOP";
                break;
            }
            params[3] = params[2] == "normal" ? "HIGH" : "LOW";
            params[4] = params[2] == "normal" ? "LOW" : "HIGH";
            params[5] = [13, 14, 15, 16].indexOf(pin) !== -1 ? "- Make sure that output current do not exceed 5 A per channel or 15 A per all PWM1-4 pins" : "";
            return params;
        },
        "retemplate": function(params) {
            if (params[1] === "heatingThermostat" || params[1] === "coolingThermostat") return "Thermostat"
            return;
        }
    },
    "Thermostat": {
        "note":     "- PPP10PPP",
        "vars":     "byte pinXXXThermostatModeState = 0;\n" +
                    "signed int pinXXXThermostatTemperatureState = 0;\n" +
                    "signed int pinXXXThermostatTemperatureCurrent = 0;",
        "channel":  "  ZUNO_THERMOSTAT(THERMOSTAT_FLAGS_OFF | THERMOSTAT_FLAGS_PPP5PPP, THERMOSTAT_UNITS_CELSIUS, THERMOSTAT_RANGE_POS, 4, pinXXXThermostatModeGetter, pinXXXThermostatModeSetter, pinXXXThermostatTemperatureGetter, pinXXXThermostatTemperatureSetter)",
        "report": "  if (REPORT_TYPE() == CC_SENSOR_MULTILEVEL && REPORT_SENSOR_TYPE() == ZUNO_SENSOR_MULTILEVEL_TYPE_TEMPERATURE) {\n" +
                    "    signed int temp;\n" +
                    "    \n" +
                    "    switch (REPORT_SENSOR_VALUE_SIZE()) {\n" +
                    "      case 1:\n" +
                    "        temp = REPORT_VALUE_1B();\n" +
                    "        break;\n" +
                    "      case 2:\n" +
                    "        temp = REPORT_VALUE_2B();\n" +
                    "        break;\n" +
                    "      case 4:\n" +
                    "        temp = REPORT_VALUE_4B();\n" +
                    "        break;\n" +
                    "    }\n" +
                    "    \n" +
                    "    // convert to 0.1 units and to C\n" +
                    "    if (REPORT_SENSOR_VALUE_PRECISION() == 0) {\n" +
                    "      temp *= 10;\n" +
                    "    }\n" +
                    "    if (REPORT_SENSOR_SCALE() != SENSOR_MULTILEVEL_SCALE_CELSIUS) {\n" +
                    "      temp = (temp - 32) * 5 / 9;\n" +
                    "    }\n" +
                    "    if (REPORT_SENSOR_VALUE_PRECISION() == 2) {\n" +
                    "      temp /= 10;\n" +
                    "    }\n" +
                    "    if (REPORT_SENSOR_VALUE_PRECISION() > 2) {\n" +
                    "      return; // ignore bigger precision\n" +
                    "    }\n" +
                    "    \n" +
                    "    pinXXXThermostatTemperatureCurrent = temp;\n" +
                    "  }",
        "setup":    "  pinMode(XXX, OUTPUT);",
        "loop":     "  if (pinXXXThermostatModeState) {PPP7PPP\n" +
                    "    if (pinXXXThermostatTemperatureState < pinXXXThermostatTemperatureCurrent - PPP6PPP) {\n" +
                    "      digitalWrite(XXX, PPP8PPP);\n" +
                    "    }\n" +
                    "    if (pinXXXThermostatTemperatureState > pinXXXThermostatTemperatureCurrent + PPP6PPP) {\n" +
                    "      digitalWrite(XXX, PPP9PPP);\n" +
                    "    }\n" +
                    "  }",
        "xetter":   "void pinXXXThermostatModeSetter(byte value) {\n" +
                    "  pinXXXThermostatModeState = value;\n" +
                    "}\n\n" +
                    "byte pinXXXThermostatModeGetter() {\n" +
                    "  return pinXXXThermostatModeState;\n" +
                    "}\n\n" +
                    "void pinXXXThermostatTemperatureSetter(byte mode, signed int value) {\n" +
                    "  pinXXXThermostatTemperatureState = value;\n" +
                    "}\n\n" +
                    "signed int pinXXXThermostatTemperatureGetter(byte mode) {\n" +
                    "  return pinXXXThermostatTemperatureState;\n" +
                    "}",
        "preAction": function(params, pin, pins) {
            params[5] = params[1] === "heatingThermostat" ? "HEAT" : "COOL"
            params[8] = (params[2] === "normal" ^ params[1] === "coolingThermostat") ? "HIGH" : "LOW";
            params[9] = (params[2] === "normal" ^ params[1] === "coolingThermostat")? "LOW" : "HIGH";
            params[6] = 10; // 1 deg C
            
            var thermostatExternalSensorPins = Object.keys(pins).filter(function(key) {
              return pins[key].type === "SwitchBinary" && (pins[key].params[1] === "heatingThermostat" || pins[key].params[1] === "coolingThermostat") && pins[key].params[3] === "external";
            });

            if (params[3] === "external") {
                params[7] = "";
                if (thermostatExternalSensorPins[0] === pin) {
                    params[10] = "Put Z-Uno in the Life Line association group of a temperature sensor. Make sure both devices share same security scheme";
                } else {
                    params.suppressNote = true;
                }
            } else {
                var ds18b20Num = parseInt(params[3].split("ds18b20_")[1]);
                params[7] = "\n    pinXXXThermostatTemperatureCurrent = temperature[" + (ds18b20Num - 1) + "];"
                params[10] = "You need to set up DS18B20 channel with at least " + ds18b20Num + " sensor" + (ds18b20Num > 1 ? "s" : "") + ".";
                params.suppressReport = true;
            }

            return params;
        }
    },
    "SwitchMultilevelPWM0": {
        "note":     "",
        "vars":     "byte pinXXXSwitchMultilevelState = 0, _pinXXXSwitchMultilevelState = 1;",
        "channel":  "  ZUNO_SWITCH_MULTILEVEL(pinXXXSwitchMultilevelGetter, pinXXXSwitchMultilevelSetter)",
        "setup":    "  pinMode(XXX, OUTPUT);\n  zunoFastPWMInit(0);",
        "loop":     "  if (pinXXXSwitchMultilevelState != _pinXXXSwitchMultilevelState) {\n" +
                    "    _pinXXXSwitchMultilevelState = pinXXXSwitchMultilevelState;\n" +
                    "    zunoFastPWMSet(255 - pinXXXSwitchMultilevelState, pinXXXSwitchMultilevelState);\n" +
                    "    zunoFastPWMEnable(0);\n" +
                    "    zunoFastPWMEnable(1);\n" +
                    "  }",
        "xetter":   "void pinXXXSwitchMultilevelSetter(byte value) {\n" +
                    "  pinXXXSwitchMultilevelState = value;\n" +
                    "}\n\n" +
                    "byte pinXXXSwitchMultilevelGetter() {\n" +
                    "  return pinXXXSwitchMultilevelState;\n" +
                    "}"
    },
    "SwitchMultilevel": {
        "note":     "- Make sure that output current do not exceed 5 A per channel or 15 A per all PWM1-4 pins",
        "vars":     "byte pinXXXSwitchMultilevelState = 0;",
        "channel":  "  ZUNO_SWITCH_MULTILEVEL(pinXXXSwitchMultilevelGetter, pinXXXSwitchMultilevelSetter)",
        "setup":    "  pinMode(XXX, OUTPUT);",
        "loop":     "  analogWrite(XXX, (word)pinXXXSwitchMultilevelState * 255 / 99);",
        "xetter":   "void pinXXXSwitchMultilevelSetter(byte value) {\n" +
                    "  pinXXXSwitchMultilevelState = value;\n" +
                    "}\n\n" +
                    "byte pinXXXSwitchMultilevelGetter() {\n" +
                    "  return pinXXXSwitchMultilevelState;\n" +
                    "}",
        "retemplate": function(params) {
            if (params[1] !== "single") return "SwitchColor";
            return;
        }
    },
    "SwitchColor": {
        "note":     "- Make sure that output current do not exceed 5 A per channel or 15 A per all PWM1-4 pins",
        "vars":     "byte pinXXXSwitchMultilevelState = 0;",
        "channel":  "  ZUNO_SWITCH_COLOR(PPP2PPP, pinsSwitchColorGetter, pinsSwitchColorSetter)",
        "setup":    "  pinMode(XXX, OUTPUT);",
        "loop":     "  analogWrite(XXX, pinXXXSwitchMultilevelState);",
        "xetter":   "void pinsSwitchColorSetter(byte color, byte value) {\n" +
                    "PPP3PPP\n" +
                    "}\n\n" +
                    "byte pinsSwitchColorGetter(byte color) {\n" +
                    "PPP4PPP\n" +
                    "}",
        "preAction": function(params, pin, pins) {
            
            var colorFlags =  {
              "white": "SWITCH_COLOR_FLAGS_WARM_WHITE",
              "red": "SWITCH_COLOR_FLAGS_RED",
              "green": "SWITCH_COLOR_FLAGS_GREEN",
              "blue": "SWITCH_COLOR_FLAGS_BLUE"
            };
            
            var colorModes =  {
              "white": "SWITCH_COLOR_COMPONENT_WARM_WHITE",
              "red": "SWITCH_COLOR_COMPONENT_RED",
              "green": "SWITCH_COLOR_COMPONENT_GREEN",
              "blue": "SWITCH_COLOR_COMPONENT_BLUE"
            };
            
            var colorChannels = Object.keys(pins).map(function(key) {
              return (pins[key].type === "SwitchMultilevel" && pins[key].params[1] != "single") ? { key: key, obj: pins[key]} : null;
            }).filter(function(x) { return x; });
            
            var colors = colorChannels.map(function(x) { return x.obj.params[1]; });
            
            var colorsFlags = colors.map(function(x) { return colorFlags[x]; });
            
            if (params[1] === colors[0]) {
                params[2] = colorsFlags.join(' | ');
                params[3] = colorChannels.map(function(x) { return "  if (color == " + colorModes[x.obj.params[1]] + ") pin" + x.key + "SwitchMultilevelState = value;"; }).join('\n');
                params[4] = colorChannels.map(function(x) { return "  if (color == " + colorModes[x.obj.params[1]] + ") return pin" + x.key + "SwitchMultilevelState;"; }).join('\n');
            } else {
                params.channels = 0;
                params.suppressChannel = true;
                params.suppressXetter = true;
            }
            
            return params;
        }
    },
    "SensorBinary": {
        "note":     "PPP5PPP",
        "vars":     "byte pinXXXSensorBinaryState;",
        "channel":  "  ZUNO_SENSOR_BINARY(PPP1PPP, pinXXXSensorBinaryGetter)",
        "setup":    "  pinMode(XXX, PPP4PPP);\n  pinXXXSensorBinaryState = PPP2PPP!digitalRead(XXX);",
        "loop":     "  byte _pinXXXSensorBinaryState = PPP2PPPdigitalRead(XXX);\n" +
                    "  if (pinXXXSensorBinaryState != _pinXXXSensorBinaryState) {\n" +
                    "    pinXXXSensorBinaryState = _pinXXXSensorBinaryState;\n" +
                    "    zunoSendReport(NNN);\n" +
                    "  }",
        "xetter":   "byte pinXXXSensorBinaryGetter() {\n" +
                    "  return pinXXXSensorBinaryState;\n" +
                    "}",
        "preAction": function(params) {
            params[1] = {
                "general": "ZUNO_SENSOR_BINARY_TYPE_GENERAL_PURPOSE",
                "smoke": "ZUNO_SENSOR_BINARY_TYPE_SMOKE",
                "co": "ZUNO_SENSOR_BINARY_TYPE_CO",
                "co2": "ZUNO_SENSOR_BINARY_TYPE_CO2",
                "heat": "ZUNO_SENSOR_BINARY_TYPE_HEAT",
                "leakage": "ZUNO_SENSOR_BINARY_TYPE_WATER",
                "freeze": "ZUNO_SENSOR_BINARY_TYPE_FREEZE",
                "tamper": "ZUNO_SENSOR_BINARY_TYPE_TAMPER",
                "door": "ZUNO_SENSOR_BINARY_TYPE_DOOR_WINDOW",
                "tilt": "ZUNO_SENSOR_BINARY_TYPE_TILT",
                "motion": "ZUNO_SENSOR_BINARY_TYPE_MOTION",
                "glassbr": "ZUNO_SENSOR_BINARY_TYPE_GLASSBREAK",
            }[params[1]];
            
            params[2] = params[2] === "normal" ? "" : "!";
            params[4] = params[3] === "pullup" ? "INPUT_PULLUP" : "INPUT";
            params[5] = params[3] === "pullup" ? "" : "- Make sure that input is always pulled to high or low level."
            
            return params;
        }
    },
    "SensorMultilevel": {
        "note":     "- Reports are sent every 30 seconds",
        "vars":     "PPP5PPP pinXXXSensorMultilevelState;",
        "channel":  "  ZUNO_SENSOR_MULTILEVEL(PPP4PPP, pinXXXSensorMultilevelGetter)",
        "setup":    "  pinMode(XXX, INPUT);",
        "loop":     "  pinXXXSensorMultilevelState = (PPP5PPP) (PPP1PPP * analogRead(XXX) / PPP2PPP) + PPP3PPP; // Math in integer numbers\n" +
                    "  zunoSendReport(NNN); // report every 30 seconds",
        "xetter":   "PPP5PPP pinXXXSensorMultilevelGetter() {\n" +
                    "  return pinXXXSensorMultilevelState;\n" +
                    "}",
        "preAction": function(params) {
            var precision = {
                "percentage": 0,
                "temperature": 1,
                "luminance": 0,
                "ppm": 0,
                "humidity": 1,
                "voltage": 1,
                "current": 1,
                "distance": 1,
                "pressure": 2,
            }[params[4]];
            
            var precision_str = {
                0: "SENSOR_MULTILEVEL_PRECISION_ZERO_DECIMALS",
                1: "SENSOR_MULTILEVEL_PRECISION_ONE_DECIMAL",
                2: "SENSOR_MULTILEVEL_PRECISION_TWO_DECIMALS"
            }[precision];
            
            var size = {
                "percentage": 1,
                "temperature": 2,
                "luminance": 2,
                "humidity": 1,
                "voltage": 2,
                "current": 2,
                "distance": 2,
                "pressure": 4,
                "ppm": 2,
            }[params[4]];
            
            var voltage_offset = {
                "3": 1023,
                "5": 831,
                "12": 862,
            }[params[5]];

            var size_str = {
                1: "SENSOR_MULTILEVEL_SIZE_ONE_BYTE",
                2: "SENSOR_MULTILEVEL_SIZE_TWO_BYTES",
                4: "SENSOR_MULTILEVEL_SIZE_FOUR_BYTES"
            }[size];
            
            var m = params[1] * Math.pow(10, precision), M = params[2] * Math.pow(10, precision);
            var frac = floatToRatio((M - m) / voltage_offset, 64);
            params[1] = frac[0];
            params[2] = frac[1];
            params[3] = Math.round(m);
            
            params[4] = {
                "percentage": "ZUNO_SENSOR_MULTILEVEL_TYPE_GENERAL_PURPOSE_VALUE, SENSOR_MULTILEVEL_SCALE_PERCENTAGE_VALUE, " + size_str + ", " + precision_str,
                "temperature": "ZUNO_SENSOR_MULTILEVEL_TYPE_TEMPERATURE, SENSOR_MULTILEVEL_SCALE_CELSIUS, " + size_str + ", " + precision_str,
                "luminance": "ZUNO_SENSOR_MULTILEVEL_TYPE_LUMINANCE, SENSOR_MULTILEVEL_SCALE_PERCENTAGE_VALUE, " + size_str + ", " + precision_str,
                "humidity": "ZUNO_SENSOR_MULTILEVEL_TYPE_RELATIVE_HUMIDITY, SENSOR_MULTILEVEL_SCALE_PERCENTAGE_VALUE, " + size_str + ", " + precision_str,
                "voltage": "ZUNO_SENSOR_MULTILEVEL_TYPE_VOLTAGE, SENSOR_MULTILEVEL_SCALE_VOLT, " + size_str + ", " + precision_str,
                "current": "ZUNO_SENSOR_MULTILEVEL_TYPE_CURRENT, SENSOR_MULTILEVEL_SCALE_AMPERE, " + size_str + ", " + precision_str,
                "distance": "ZUNO_SENSOR_MULTILEVEL_TYPE_DISTANCE, SENSOR_MULTILEVEL_SCALE_METER, " + size_str + ", " + precision_str,
                "pressure": "ZUNO_SENSOR_MULTILEVEL_TYPE_ATMOSPHERIC_PRESSURE, SENSOR_MULTILEVEL_SCALE_KILO_PASCAL, " + size_str + ", " + precision_str,
                "ppm": "ZUNO_SENSOR_MULTILEVEL_TYPE_CO2_LEVEL, SENSOR_MULTILEVEL_SCALE_PARTS_PER_MILLION, " + size_str + ", " + precision_str
            }[params[4]];
            
            params[5] = {
                1: "byte",
                2: "word",
                4: "dword"
            }[size];
            
            return params;
        }
    },
    "DHT": {
        "note":     "- Connect PPP1PPP sensor.",
        "includes": "#include \"ZUNO_DHT.h\"",
        "vars":     "DHT pinXXXDHT(XXX, PPP1PPP);\n" +
                    "\n" +
                    "signed int pinXXXDHTTemperatureState;\n" +
                    "byte pinXXXDHTHumidityState;",
        "channel":  "  ZUNO_SENSOR_MULTILEVEL(ZUNO_SENSOR_MULTILEVEL_TYPE_TEMPERATURE, SENSOR_MULTILEVEL_SCALE_CELSIUS, SENSOR_MULTILEVEL_SIZE_TWO_BYTES, SENSOR_MULTILEVEL_PRECISION_ONE_DECIMAL, pinXXXDHTTemperatureGetter),\n" +
                    "  ZUNO_SENSOR_MULTILEVEL(ZUNO_SENSOR_MULTILEVEL_TYPE_RELATIVE_HUMIDITY, SENSOR_MULTILEVEL_SCALE_PERCENTAGE_VALUE, SENSOR_MULTILEVEL_SIZE_ONE_BYTE, SENSOR_MULTILEVEL_PRECISION_ZERO_DECIMALS, pinXXXDHTHumidityGetter)",
        "setup":    "  pinXXXDHT.begin();",
        "loop":     "  pinXXXDHTTemperatureState = pinXXXDHT.readTemperatureC10();\n" +
                    "  pinXXXDHTHumidityState = pinXXXDHT.readHumidity();\n" +
                    "  zunoSendReport(NNN); // report every 30 seconds\n" +
                    "  zunoSendReport(NNN + 1);",
        "xetter":   "word pinXXXDHTTemperatureGetter() {\n" +
                    "  return pinXXXDHTTemperatureState;\n" +
                    "}\n" +
                    "\n" +
                    "byte pinXXXDHTHumidityGetter() {\n" +
                    "  return pinXXXDHTHumidityState;\n" +
                    "}",
        "preAction": function(params) {
            params.channels = 2;
            return params;
        }
    },
    "DS18B20": {
        "note":     "- Connect PPP1PPP DS18B20 sensors.",
        "includes": "#include \"ZUNO_DS18B20.h\"",
        "vars":     "OneWire ow(XXX);\n" +
                    "DS18B20Sensor ds18b20(&ow);\n" +
                    "\n" +
                    "byte addresses[8 * PPP1PPP + 8]; // last one for search\n" +
                    "byte number_of_sensors; // Number of sensors found (if less than PPP1PPP connected)\n" +
                    "signed int temperature[PPP1PPP];",
        "channel":  "PPP2PPP",
        "setup":    "  number_of_sensors = ds18b20.findAllSensors(addresses);",
        "loop":     "PPP3PPP",
        "xetter":   "PPP4PPP",
        "preAction": function(params) {
            params.channels = parseInt(params[1]);
            var chDefs = [], codeDefs = [], getterDefs = [];
            for (var n = 0; n < params.channels; n++) {
                chDefs.push("  ZUNO_SENSOR_MULTILEVEL(ZUNO_SENSOR_MULTILEVEL_TYPE_TEMPERATURE, SENSOR_MULTILEVEL_SCALE_CELSIUS, SENSOR_MULTILEVEL_SIZE_TWO_BYTES, SENSOR_MULTILEVEL_PRECISION_ONE_DECIMAL, pinXXXSensorDS18B20Getter_" + (n + 1) + ")");
                codeDefs.push("  if (number_of_sensors >= " + (n + 1) + ") {\n    temperature[" + n + "] = ds18b20.getTempC100(&addresses[8 * " + n + "])/10;\n    zunoSendReport(NNN + " + n + ");\n  }");
                getterDefs.push("word pinXXXSensorDS18B20Getter_" + (n + 1) + "() {\n  return temperature[" + n + "];\n}");
            }
            params[2] = chDefs.join(",\n");
            params[3] = codeDefs.join("\n");
            params[4] = getterDefs.join("\n\n");
            return params;
        }
    },
    "UART": {
        "note":     "- No channel is created for UART - define a channel if needed and write the code to send and parse commands.",
        "vars":     "",
        "channel":  "",
        "setup":    "  Serial1.begin(PPP1PPP);",
        "loop":     "",
    "funcs":    "char readByteUART() {\n" +
                    "  while(Serial1.available() <= 0) delay(1);\n" +
                    "  return Serial1.read();\n" +
                    "}\n" +
                    "\n" +
                    "void writeUART(char b) {\n" +
                    "  Serial1.write(b);\n" +
                    "}",
        "xetter":   "",
        "preAction": function(params, pin) {
            params.channels = 0;
            if (pin === "8") params.suppressSetup = params.suppressFuncs = true;
            return params;
        }
    },
    "RS485": {
        "note":     "- No channel is created for RS485 - define a channel if needed and write the code to send and parse commands.\n" +
                    "- Pin 2 is also occupied by RS485.",
        "vars":     "",
        "channel":  "",
        "setup":    "  Serial1.begin(PPP1PPP);\n" +
                    "  pinMode(2, OUTPUT);\n" +
                    "  digitalWrite(2, LOW);",
        "loop":     "",
    "funcs":    "char readByteRS485() {\n" +
                    "  while(Serial1.available() <= 0) delay(1);\n" +
                    "  return Serial1.read();\n" +
                    "}\n" +
                    "\n" +
                    "void writeRS485(char b) {\n" +
                    "  digitalWrite(2, HIGH);\n" +
                    "  delay(5);\n" +
                    "  Serial1.write(b);\n" +
                    "  delay(5);\n" +
                    "  digitalWrite(2, LOW);\n" +
                    "}",
        "xetter":   "",
        "preAction": function(params, pin) {
            params.channels = 0;
            if (pin === "8") params.suppressSetup = params.suppressFuncs = true;
            return params;
        }
    }
};

function detemplate(template, key, channelNum, assocNum, params) {
    if (!template) return template;
    Object.keys(params).map(function(paramName) { if (parseInt(paramName)) template = template.replace(new RegExp('PPP' + paramName + 'PPP', 'g'), params[paramName]); });
    return template.replace(/XXX/g, key).replace(/NNN/g, channelNum).replace(/AAA/g, assocNum);
}

function pinsToTemplates(pins) {
    var templates = [];
 
    var channelNum = 1;
    var assocNum = 1;
    Object.keys(pins).map(function(key) {
        if (pins[key].type === "NC") return; // no channel
        
        var templ = codeTemplates[pins[key].type];
        if (!templ) {
            alert("Can not find code template for " + pins[key].type);
            return;
        }
        var params = clone(pins[key].params);
        if (templ.retemplate) {
            var templName = templ.retemplate(params, pins); // change template if needed
            if (templName) templ = codeTemplates[templName];
        }
        if (templ.preAction) params = templ.preAction(params, key, pins); // apply pre action on params
        
        templates.push({
            "note": !params.suppressNote && detemplate(templ.note, key, channelNum, assocNum, params),
            "includes": !params.suppressIncludes && detemplate(templ.includes, key, channelNum, assocNum, params),
            "vars": !params.suppressVars && detemplate(templ.vars, key, channelNum, assocNum, params),
            "channel": !params.suppressChannel && detemplate(templ.channel, key, channelNum, assocNum, params),
            "report": !params.suppressReport && detemplate(templ.report, key, channelNum, assocNum, params),
            "setup": !params.suppressSetup && detemplate(templ.setup, key, channelNum, assocNum, params),
            "loop": !params.suppressLoop && detemplate(templ.loop, key, channelNum, assocNum, params),
            "xetter": !params.suppressXetter && detemplate(templ.xetter, key, channelNum, assocNum, params),
            "funcs": !params.suppressFuncs && detemplate(templ.funcs, key, channelNum, assocNum, params),
            "key": key,
        });
        
        channelNum += params.channels !== undefined ? params.channels : 1;
        assocNum += params.assocs !== undefined ? params.assocs : 0;
    });
    
    return templates;
}

function clone(obj) {
    var copy = {};
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
           copy[prop] = obj[prop];
        }
    }
    return copy;
}

function floatToRatio(x, maxNumerator) {
    var tolerance = 1.0E-6;
    var h1 = 1, h2 = 0;
    var k1 = 0, k2 = 1;
    var b = Math.abs(x);
    do {
        var a = Math.floor(b);
        var aux = h1;
        if (a*h1+h2 >= maxNumerator) break;
        
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
    var templates = pinsToTemplates(pins);

    // filter uses for bool condition
    var includes = templates.map(function(ch) { return ch.includes; }).filter(function(value, index, self) { return self.indexOf(value) === index && !!value; }).join('\n');
    var vars = templates.map(function(ch) { return ch.vars; } ).filter(function(value) { return !!value; }).join('\n\n');
    var channels = templates.map(function(ch) { return ch.channel; } ).filter(function(value) { return !!value; }).join(',\n');
    var reports = templates.map(function(ch) { return ch.report; } ).filter(function(value) { return !!value; }).join(',\n');
    var setup = templates.map(function(ch) { return ch.setup; } ).filter(function(value) { return !!value; }).join('\n\n');
    var loop = templates.map(function(ch) { return ch.loop; } ).filter(function(value) { return !!value; }).join('\n\n');
    var xetter = templates.map(function(ch) { return ch.xetter; } ).filter(function(value) { return !!value; }).join('\n\n');
    var funcs = templates.map(function(ch) { return ch.funcs; } ).filter(function(value) { return !!value; }).join('\n\n');
    var notes = templates.map(function(ch) { return ch.note; } ).filter(function(value) { return !!value; }).join('\n\n');
    var keys = templates.map(function(ch) { if (ch.note) return ch.key; } ).filter(function(value) { return !!value; }).join(',');

    var htmlrels = htmlCEl('relation');


    if (htmlrels.length > 1) {
        var cvars = templates.map(
            function(ch) {
                return ch.vars.split(/\s+/).map(
                        // remove punctuation
                        function(value) {
                            return value.replace(/[;,]/g, "") 
                        }
                ).filter(
                    // filter for vars
                    function(value) { 
                        if (value.indexOf("pin") != -1 || value.indexOf("temperature") != -1) return value;
                    }
                )
            } 
        ).filter(
            // bool
            function(value) { 
                return !!value; 
        });

        for (i = 1; i < htmlrels.length; i++) {
            // update relelems obj
            findRelationEl(i);
            var sensor_sb = relelems.sensor.select,
                condition_sb = relelems.condition.select,
                device_sb = relelems.device.select,
                mode_sb = relelems.mode.select,
                condition_input = relelems.condition.input,
                swmul_input = relelems.device.input;

            console.log(sensor_sb.options[sensor_sb.selectedIndex].value)
            console.log(condition_sb.options[condition_sb.selectedIndex].value)
            console.log(device_sb.options[device_sb.selectedIndex].value)
            console.log(condition_input.value)
            console.log(swmul_input.value)
        }
    }


    if (!includes && !vars && !channels && !setup && !loop && !xetter && !notes && !funcs)
        return {
            "code": "// Please select features",
            "notes": "No notes"
        };
    
    return {
        "code":
            "" + includes + (includes ? "\n\n" : "") + "" +
            "// Global variables\n\n" +
            vars + "\n\n" +
            "// Z-Wave channels\n" +
            "ZUNO_SETUP_CHANNELS(\n" + channels + "\n);\n\n" +
            "" + (reports ? ("ZUNO_REPORTS_HANDLER(reportHandler);\n\n") : "") + "" +
            "void setup() {\n" +
              setup + "\n" +
            "}\n\n" +
            "void loop() {\n" +
              loop + "\n\n" +
            "  delay(20);\n" +
            "}\n\n" +
            "// Getters and setters\n\n" +
            xetter + "" +
            "" + (reports ? ("\n\nvoid reportHandler(void) {\n" + reports + "\n}") : "") +
            "" + (funcs ? ("\n\n// Functions\n" + funcs) : ""),
        "notes": notes ? notes : "No notes",
        "keys": keys ? keys : "No keys"
    };
};
