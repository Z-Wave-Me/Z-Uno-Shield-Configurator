// Helpers
function svgEl(id, obj) { 
    return document.getElementById(obj ? obj : 'obj').contentDocument.getElementById(id);
}

function htmlEl(id) {
    return document.getElementById(id);
}
function htmlCEl(cn) {
    return document.getElementsByClassName(cn);
}

function htmlElsEna(name, ena) {
    document.getElementsByName(name).forEach(function(el) {
        el.disabled = !ena;
    });
}

function pinModesEls(prefix, func) {
    document.querySelectorAll('[id^=' + prefix + '_]').forEach(function(el) { if (!el.id.match("param")) func(el); });
}

// Saving settings

var params = {};
function updateSettings() {
    window.history.replaceState(null, null, 
        window.location.href.split('?')[0] + 
        '?' + 
        Object.keys(params).map(function(key) { return key + '=' + params[key]; }).join('&')
    );
}

function updateSetting(pin, group, mode) {
    // save pin mode
    params[pin] = mode;
    
    // delete old pin mode parameters
    Object.keys(params).map(function(key) {
        if (key.match("^" + pin + "_.*_param_.*$"))
            delete params[key];
    });
    // save pin mode parameters
    paramObjs = document.querySelectorAll('[id^=' + pin + '_' + mode + '_param_]');
    Object.keys(paramObjs).map(function(index) {
        if (parseInt(index) != index) return; // unstrict == to allow "number"
        params[paramObjs[index].id] = paramObjs[index].value;
    });
    
    updateSettings();
}

function setPinSettings(pin, group, type) {
    if (!pins[pin]) pins[pin] = {};
    
    if (type !== undefined && type !== null) {
        pins[pin].type = type;
    }
    
    paramObjs = document.querySelectorAll('[id^=' + group + '_param_]');
    pins[pin].params = {};
    Object.keys(paramObjs).map(function(index) {
        if (parseInt(index) != index) return; // unstrict == to allow "number"
        pins[pin].params[paramObjs[index].id.replace(/^(.*)_param_/,"")] = paramObjs[index].value;
    });
}

function updateParams() {
    var reg = this.id.match(/^((pin([^_]+))_(.*))_param_.*$/);
    if (!reg || reg.length < 3) return;

    var group = reg[1],
        pin = reg[2],
        pinNum = reg[3],
        mode = reg[4];
    
    setPinSettings(pinNum, group, null);
    updateSetting(pin, group, mode);
    updateParamsUI(pin, group);
    updateCode();
}

function updateParamsUI(pin, group) {
    if (htmlEl('settings_' + pin)) {
        htmlEl('settings_' + pin).querySelectorAll('[id*=_params]').forEach(function(el) { el.style.display = "none"; });
    }
    if (htmlEl(group + '_params')) {
        htmlEl(group + '_params').querySelectorAll('[id^=' + group + '_param_]').forEach(function(el) {
            if (el.value === undefined || el.value === "") {
                el.value = defaultParams[el.id];
                el.onchange();
            }
        });
        htmlEl(group + '_params').style.display = "block";
        htmlEl(group + '_params').querySelectorAll('[id^=' + group + '_param_]').forEach(function(el) {
            if (el.getAttribute('depend')) {
                var hide = 1;
                el.getAttribute('depend').split(',').forEach(function(dep) {
                    if (htmlEl(dep.split('=')[0]).value === dep.split('=')[1]) {
                        hide = 0;
                    }
                });
                el.style.display = hide ? 'none' : 'inline';
            }
        });
    }
}

// Jumpers

function jumersADC() {
    var reg = this.id.match(/^(pin([^_]+))_(.*)$/);
    if (!reg || reg.length < 3) return;
    
    var group = this.id,
        pin = reg[1],
        pinNum = reg[2],
        mode = reg[3];
    
    if (mode === "i_3" || mode === "o_3" || mode === "ADC_i_3") {
        svgEl('jumper_' + pin + '_io_3').style.display = "block";
        svgEl('jumper_' + pin + '_i_5').style.display = "none";
        svgEl('jumper_' + pin + '_i_12').style.display = "none";
        svgEl('jumper_' + pin + '_i_5_12').style.display = "none";
        svgEl('direction_' + pin + '_o').style.opacity = (mode === "o_3") ? 1 : 0;
        svgEl('direction_' + pin + '_i').style.opacity = (mode === "o_3") ? 0 : 1;
        svgEl('type_' + pin + '_analog').style.opacity = (mode === "ADC_i_3") ? 1 : 0;
        svgEl('type_' + pin + '_digital').style.opacity = (mode === "ADC_i_3") ? 0 : 1;


        svgEl('jumper_' + pin + '_io_3', 'obj_2').style.display = "block";
        svgEl('jumper_' + pin + '_i_5', 'obj_2').style.display = "none";
        svgEl('jumper_' + pin + '_i_12', 'obj_2').style.display = "none";
        svgEl('jumper_' + pin + '_i_5_12', 'obj_2').style.display = "none";
    } else if (mode === "ADC_i_5" || mode === "i_5") {
        svgEl('jumper_' + pin + '_io_3').style.display = "none";
        svgEl('jumper_' + pin + '_i_5').style.display = "block";
        svgEl('jumper_' + pin + '_i_12').style.display = "none";
        svgEl('jumper_' + pin + '_i_5_12').style.display = "block";
        svgEl('direction_' + pin + '_o').style.opacity = 0;
        svgEl('direction_' + pin + '_i').style.opacity = 1;
        svgEl('type_' + pin + '_analog').style.opacity = (mode === "ADC_i_5") ? 1 : 0;
        svgEl('type_' + pin + '_digital').style.opacity = (mode === "ADC_i_5") ? 0 : 1;

        svgEl('jumper_' + pin + '_io_3', 'obj_2').style.display = "none";
        svgEl('jumper_' + pin + '_i_5', 'obj_2').style.display = "block";
        svgEl('jumper_' + pin + '_i_12', 'obj_2').style.display = "none";
        svgEl('jumper_' + pin + '_i_5_12', 'obj_2').style.display = "block";
    } else if (mode === "ADC_i_12" || mode === "i_12") {
        svgEl('jumper_' + pin + '_io_3').style.display = "none";
        svgEl('jumper_' + pin + '_i_5').style.display = "none";
        svgEl('jumper_' + pin + '_i_12').style.display = "block";
        svgEl('jumper_' + pin + '_i_5_12').style.display = "block";
        svgEl('direction_' + pin + '_o').style.opacity = 0;
        svgEl('direction_' + pin + '_i').style.opacity = 1;
        svgEl('type_' + pin + '_analog').style.opacity = (mode === "ADC_i_12") ? 1 : 0;
        svgEl('type_' + pin + '_digital').style.opacity = (mode === "ADC_i_12") ? 0 : 1;

        svgEl('jumper_' + pin + '_io_3', 'obj_2').style.display = "none";
        svgEl('jumper_' + pin + '_i_5', 'obj_2').style.display = "none";
        svgEl('jumper_' + pin + '_i_12', 'obj_2').style.display = "block";
        svgEl('jumper_' + pin + '_i_5_12', 'obj_2').style.display = "block";
    } else if (mode === "NC") {
        svgEl('jumper_' + pin + '_io_3').style.display = "none";
        svgEl('jumper_' + pin + '_i_5').style.display = "none";
        svgEl('jumper_' + pin + '_i_12').style.display = "none";
        svgEl('jumper_' + pin + '_i_5_12').style.display = "none";
        svgEl('direction_' + pin + '_o').style.opacity = 0;
        svgEl('direction_' + pin + '_i').style.opacity = 0;
        svgEl('type_' + pin + '_analog').style.opacity = 0;
        svgEl('type_' + pin + '_digital').style.opacity = 0;

        svgEl('jumper_' + pin + '_io_3', 'obj_2').style.display = "none";
        svgEl('jumper_' + pin + '_i_5', 'obj_2').style.display = "none";
        svgEl('jumper_' + pin + '_i_12', 'obj_2').style.display = "none";
        svgEl('jumper_' + pin + '_i_5_12', 'obj_2').style.display = "none";
    }
    
    if (pin === 'pin3') {
        htmlElsEna('pin3pwm', mode === "NC");
        htmlEl('pin3pwm_disabled').style.display = mode === "NC" ? 'none': 'block';
    }
    
    if (mode === "i_3" || mode === "i_5" || mode === "i_12") {
        setPinSettings(pinNum, group, "SensorBinary");
    } else if (mode === "o_3") {
        setPinSettings(pinNum, group, "SwitchBinary");
    } else if (mode === "ADC_i_3" || mode === "ADC_i_5" || mode === "ADC_i_12") {
        setPinSettings(pinNum, group, "SensorMultilevel");
    } else {
        setPinSettings(pinNum, group, "NC");
    }
    
    updateParamsUI(pin, group);
    updateSetting(pin, group, mode);
    updateCode();
}

function jumersPWM() {
    var reg = this.id.match(/^(pin([^_]+))_(.*)$/);
    if (!reg || reg.length < 3) return;
    
    var group = this.id,
        pin = reg[1],
        pinNum = reg[2],
        mode = reg[3];
        
    if (mode === "o") {
        svgEl('direction_' + pin + '_o').style.opacity = 1;
        svgEl('type_' + pin + '_pwm').style.opacity = 0;
        svgEl('type_' + pin + '_digital').style.opacity = 1;
    } else if (mode === "PWM") {
        svgEl('direction_' + pin + '_o').style.opacity = 1;
        svgEl('type_' + pin + '_pwm').style.opacity = 1;
        svgEl('type_' + pin + '_digital').style.opacity = 0;
    } else if (mode === "NC") {
        svgEl('direction_' + pin + '_o').style.opacity = 0;
        svgEl('type_' + pin + '_pwm').style.opacity = 0;
        svgEl('type_' + pin + '_digital').style.opacity = 0;
    }
    
    if (mode === "o") {
        setPinSettings(pinNum, group, "SwitchBinary");
    } else if (mode === "PWM") {
        setPinSettings(pinNum, group, "SwitchMultilevel");
    } else {
        setPinSettings(pinNum, group, "NC");
    }
    
    updateParamsUI(pin, group);
    updateSetting(pin, group, mode);
    updateCode();
}

function jumersPWM0() {
    var reg = this.id.match(/^(pin([^_]+))_(.*)$/);
    if (!reg || reg.length < 3) return;

    var group = this.id,
        pin = reg[1],
        pinNum = reg[2],
        mode = reg[3];
    
    if (mode === "PWM") {
        svgEl('jumper_' + pin).style.display = "block";
        svgEl('jumper_' + pin, 'obj_2').style.display = "block";

        svgEl('direction_' + pin + '_o').style.opacity = 1;
        svgEl('type_' + pin + '_pwm').style.opacity = 1;
        htmlElsEna('pin3', false);
        htmlEl('pin3_disabled').style.display = 'block';
    } else if (mode === "NC") {
        svgEl('jumper_' + pin).style.display = "none";
        svgEl('jumper_' + pin, 'obj_2').style.display = "none";

        svgEl('direction_' + pin + '_o').style.opacity = 0;
        svgEl('type_' + pin + '_pwm').style.opacity = 0;
        htmlElsEna('pin3', true);
        htmlEl('pin3_disabled').style.display = 'none';
    }
    
    if (mode === "PWM") {
        setPinSettings(pinNum === "3pwm" ? "3" : pinNum, group, "SwitchMultilevelPWM0");
    } else {
        setPinSettings(pinNum === "3pwm" ? "3" : pinNum, group, "NC");
    }
    
    updateParamsUI(pin, group);
    updateSetting(pin, group, mode);
    updateCode();
}

function jumersGPIO() {
    var reg = this.id.match(/^(pin([^_]+))_(.*)$/);
    if (!reg || reg.length < 3) return;
    
    var group = this.id,
        pin = reg[1],
        pinNum = reg[2],
        mode = reg[3];
    
    if (mode === "o_3") {
        svgEl('direction_' + pin + '_i').style.opacity = 0;
        svgEl('direction_' + pin + '_o').style.opacity = 1;
        svgEl('type_' + pin + '_digital').style.opacity = 1;
        svgEl('type_' + pin + '_dht').style.opacity = 0;
    } else if (mode === "i_3") {
        svgEl('direction_' + pin + '_i').style.opacity = 1;
        svgEl('direction_' + pin + '_o').style.opacity = 0;
        svgEl('type_' + pin + '_digital').style.opacity = 1;
        svgEl('type_' + pin + '_dht').style.opacity = 0;
    } else if (mode === "dht") {
        svgEl('direction_' + pin + '_i').style.opacity = 1;
        svgEl('direction_' + pin + '_o').style.opacity = 1;
        svgEl('type_' + pin + '_digital').style.opacity = 0;
        svgEl('type_' + pin + '_dht').style.opacity = 1;
    } else if (mode === "NC") {
        svgEl('direction_' + pin + '_i').style.opacity = 0;
        svgEl('direction_' + pin + '_o').style.opacity = 0;
        svgEl('type_' + pin + '_digital').style.opacity = 0;
        svgEl('type_' + pin + '_dht').style.opacity = 0;
    }
    
    if (mode === "i_3") {
        setPinSettings(pinNum, group, "SensorBinary");
    } else if (mode === "o_3") {
        setPinSettings(pinNum, group, "SwitchBinary");
    } else if (mode === "dht") {
        setPinSettings(pinNum, group, "DHT");
    } else {
        setPinSettings(pinNum, group, "NC");
    }
    
    updateParamsUI(pin, group);
    updateSetting(pin, group, mode);
    updateCode();
}

function jumersOneWire() {
    var reg = this.id.match(/^(pin([^_]+))_(.*)$/);
    if (!reg || reg.length < 3) return;
    
    var group = this.id,
        pin = reg[1],
        pinNum = reg[2],
        mode = reg[3];
    
    if (mode === "o_3") {
        svgEl('direction_' + pin + '_i').style.opacity = 0;
        svgEl('direction_' + pin + '_o').style.opacity = 1;
        svgEl('type_' + pin + '_digital').style.opacity = 1;
        svgEl('type_' + pin + '_onewire').style.opacity = 0;
        svgEl('type_' + pin + '_dht').style.opacity = 0;
    } else if (mode === "i_3") {
        svgEl('direction_' + pin + '_i').style.opacity = 1;
        svgEl('direction_' + pin + '_o').style.opacity = 0;
        svgEl('type_' + pin + '_digital').style.opacity = 1;
        svgEl('type_' + pin + '_onewire').style.opacity = 0;
        svgEl('type_' + pin + '_dht').style.opacity = 0;
    } else if (mode === "dht") {
        svgEl('direction_' + pin + '_i').style.opacity = 1;
        svgEl('direction_' + pin + '_o').style.opacity = 1;
        svgEl('type_' + pin + '_digital').style.opacity = 0;
        svgEl('type_' + pin + '_onewire').style.opacity = 0;
        svgEl('type_' + pin + '_dht').style.opacity = 1;
    } else if (mode === "onewire") {
        svgEl('direction_' + pin + '_i').style.opacity = 1;
        svgEl('direction_' + pin + '_o').style.opacity = 1;
        svgEl('type_' + pin + '_digital').style.opacity = 0;
        svgEl('type_' + pin + '_onewire').style.opacity = 1;
        svgEl('type_' + pin + '_dht').style.opacity = 0;
    } else if (mode === "NC") {
        svgEl('direction_' + pin + '_i').style.opacity = 0;
        svgEl('direction_' + pin + '_o').style.opacity = 0;
        svgEl('type_' + pin + '_digital').style.opacity = 0;
        svgEl('type_' + pin + '_onewire').style.opacity = 0;
        svgEl('type_' + pin + '_dht').style.opacity = 0;
    }
    
    if (mode === "i_3") {
        setPinSettings(pinNum, group, "SensorBinary");
    } else if (mode === "o_3") {
        setPinSettings(pinNum, group, "SwitchBinary");
    } else if (mode === "dht") {
        setPinSettings(pinNum, group, "DHT");
    } else if (mode === "onewire") {
        setPinSettings(pinNum, group, "DS18B20");
    } else {
        setPinSettings(pinNum, group, "NC");
    }
    
    updateParamsUI(pin, group);
    updateSetting(pin, group, mode);
    updateCode();
}

function jumersUART() {
    var reg = this.id.match(/^(pin([^_]+))_(.*)$/);
    if (!reg || reg.length < 3) return;
    
    var group = this.id,
        pin = reg[1],
        pinNum = reg[2],
        mode = reg[3];
    
    if (mode === "UART") {
        svgEl('jumper_RX_UART').style.opacity = 1;
        svgEl('jumper_TX_UART').style.opacity = 1;
        svgEl('jumper_RX_RS485').style.opacity = 0;
        svgEl('jumper_TX_RS485').style.opacity = 0;
        svgEl('jumper_RS485_A').style.display = "none";
        svgEl('jumper_RS485_B').style.display = "none";
        svgEl('jumper_CTRL_RS485').style.display = "none";

        svgEl('jumper_RX_UART', 'obj_2').style.opacity = 1;
        svgEl('jumper_TX_UART', 'obj_2').style.opacity = 1;
        svgEl('jumper_RX_RS485', 'obj_2').style.opacity = 0;
        svgEl('jumper_TX_RS485', 'obj_2').style.opacity = 0;
        svgEl('jumper_RS485_A', 'obj_2').style.display = "none";
        svgEl('jumper_RS485_B', 'obj_2').style.display = "none";
        svgEl('jumper_CTRL_RS485', 'obj_2').style.display = "none";

        svgEl('direction_pin7_o').style.opacity = 1;
        svgEl('direction_pin7_i').style.opacity = 0;
        svgEl('direction_pin8_o').style.opacity = 0;
        svgEl('direction_pin8_i').style.opacity = 1;
        svgEl('type_pin7_uart').style.opacity = 1;
        svgEl('type_pin8_uart').style.opacity = 1;
        svgEl('type_pin7_rs485').style.opacity = 0;
        svgEl('type_pin8_rs485').style.opacity = 0;
        svgEl('type_pin7_digital').style.opacity = 0;
        svgEl('type_pin8_digital').style.opacity = 0;
        if (pin === 'pin7' && (!htmlEl('pin8_UART').checked)) {
            htmlEl('pin8_UART').click();
        }
        if (pin === 'pin8' && (!htmlEl('pin7_UART').checked)) {
            htmlEl('pin7_UART').click();
        }
    } else if (mode === "RS485") {
        svgEl('jumper_RX_UART').style.opacity = 0;
        svgEl('jumper_TX_UART').style.opacity = 0;
        svgEl('jumper_RX_RS485').style.opacity = 1;
        svgEl('jumper_TX_RS485').style.opacity = 1;
        svgEl('jumper_RS485_A').style.display = "block";
        svgEl('jumper_RS485_B').style.display = "block";
        svgEl('jumper_CTRL_RS485').style.display = "block";

        svgEl('jumper_RX_UART', 'obj_2').style.opacity = 0;
        svgEl('jumper_TX_UART', 'obj_2').style.opacity = 0;
        svgEl('jumper_RX_RS485', 'obj_2').style.opacity = 1;
        svgEl('jumper_TX_RS485', 'obj_2').style.opacity = 1;
        svgEl('jumper_RS485_A', 'obj_2').style.display = "block";
        svgEl('jumper_RS485_B', 'obj_2').style.display = "block";
        svgEl('jumper_CTRL_RS485', 'obj_2').style.display = "block";

        svgEl('direction_pin7_o').style.opacity = 1;
        svgEl('direction_pin7_i').style.opacity = 1;
        svgEl('direction_pin8_o').style.opacity = 1;
        svgEl('direction_pin8_i').style.opacity = 1;
        svgEl('type_pin7_uart').style.opacity = 0;
        svgEl('type_pin8_uart').style.opacity = 0;
        svgEl('type_pin7_rs485').style.opacity = 1;
        svgEl('type_pin8_rs485').style.opacity = 1;
        svgEl('type_pin7_digital').style.opacity = 0;
        svgEl('type_pin8_digital').style.opacity = 0;
        if (pin === 'pin7' && (!htmlEl('pin8_RS485').checked)) {
            htmlEl('pin8_RS485').click();
        }
        if (pin === 'pin8' && (!htmlEl('pin7_RS485').checked)) {
            htmlEl('pin7_RS485').click();
        }
    } else if (mode === "i_3" || mode === "o_3") {
        if (pin === 'pin8') {
            svgEl('jumper_RX_UART').style.opacity = 1;
            svgEl('jumper_RX_UART', 'obj_2').style.opacity = 1;
        }
        if (pin === 'pin7') {
            svgEl('jumper_TX_UART').style.opacity = 1;
            svgEl('jumper_TX_UART', 'obj_2').style.opacity = 1;
        }
        svgEl('jumper_RX_RS485').style.opacity = 0;
        svgEl('jumper_TX_RS485').style.opacity = 0;
        svgEl('jumper_RS485_A').style.display = "none";
        svgEl('jumper_RS485_B').style.display = "none";
        svgEl('jumper_CTRL_RS485').style.display = "none";
        
        svgEl('jumper_RX_RS485', 'obj_2').style.opacity = 0;
        svgEl('jumper_TX_RS485', 'obj_2').style.opacity = 0;
        svgEl('jumper_RS485_A', 'obj_2').style.display = "none";
        svgEl('jumper_RS485_B', 'obj_2').style.display = "none";
        svgEl('jumper_CTRL_RS485', 'obj_2').style.display = "none";

        svgEl('direction_' + pin + '_i').style.opacity = (mode === "i_3") ? 1 : 0;
        svgEl('direction_' + pin + '_o').style.opacity = (mode === "o_3") ? 1 : 0;
        svgEl('type_' + pin + '_uart').style.opacity = 0;
        svgEl('type_' + pin + '_rs485').style.opacity = 0;
        svgEl('type_' + pin + '_digital').style.opacity = 1;
        if (pin === 'pin7' && (htmlEl('pin8_RS485').checked || htmlEl('pin8_UART').checked)) {
            htmlEl('pin8_NC').click();
        }
        if (pin === 'pin8' && (htmlEl('pin7_RS485').checked || htmlEl('pin7_UART').checked)) {
            htmlEl('pin7_NC').click();
        }
    } else if (mode === "NC") {
        if (pin === 'pin8') {
            svgEl('jumper_RX_UART').style.opacity = 0;
            svgEl('jumper_RX_UART', 'obj_2').style.opacity = 0;
        }
        if (pin === 'pin7') {
            svgEl('jumper_TX_UART').style.opacity = 0;
            svgEl('jumper_TX_UART', 'obj_2').style.opacity = 0;
        }
        svgEl('jumper_RX_RS485').style.opacity = 0;
        svgEl('jumper_TX_RS485').style.opacity = 0;
        svgEl('jumper_RS485_A').style.display = "none";
        svgEl('jumper_RS485_B').style.display = "none";
        svgEl('jumper_CTRL_RS485').style.display = "none";

        svgEl('jumper_RX_RS485', 'obj_2').style.opacity = 0;
        svgEl('jumper_TX_RS485', 'obj_2').style.opacity = 0;
        svgEl('jumper_RS485_A', 'obj_2').style.display = "none";
        svgEl('jumper_RS485_B', 'obj_2').style.display = "none";
        svgEl('jumper_CTRL_RS485', 'obj_2').style.display = "none";
        
        svgEl('direction_' + pin + '_i').style.opacity = 0;
        svgEl('direction_' + pin + '_o').style.opacity = 0;
        svgEl('type_' + pin + '_uart').style.opacity = 0;
        svgEl('type_' + pin + '_rs485').style.opacity = 0;
        svgEl('type_' + pin + '_digital').style.opacity = 0;

        if (pin === 'pin7' && (htmlEl('pin8_RS485').checked || htmlEl('pin8_UART').checked)) {
            htmlEl('pin8_NC').click();
        }
        if (pin === 'pin8' && (htmlEl('pin7_RS485').checked || htmlEl('pin7_UART').checked)) {
            htmlEl('pin7_NC').click();
        }
    }
    
    if (mode === "i_3") {
        setPinSettings(pinNum, group, "SensorBinary");
    } else if (mode === "o_3") {
        setPinSettings(pinNum, group, "SwitchBinary");
    } else if (mode === "UART") {
        setPinSettings(pinNum, group, "UART");
    } else if (mode === "RS485") {
        setPinSettings(pinNum, group, "RS485");
    } else {
        setPinSettings(pinNum, group, "NC");
    }

    updateParamsUI(pin, group);
    updateSetting(pin, group, mode);
    updateCode();
}
// Prototypes
if (!NodeList.prototype.forEach) NodeList.prototype.forEach = Array.prototype.forEach;

// TODO: [13]
function loadConfiguration() {
    // Attach handlers
    document.querySelectorAll('[id*=_param_]').forEach(function(el) { el.onchange = updateParams; });
    for (var n = 3; n <= 6; n++)
        pinModesEls('pin' + n, function(el) { el.onclick = jumersADC; });
    for (var n = 7; n <= 8; n++)
        pinModesEls('pin' + n, function(el) { el.onclick = jumersUART;});
    for (var n = 13; n <= 16; n++)
        pinModesEls('pin' + n, function(el) { el.onclick = jumersPWM; });
    pinModesEls('pin3pwm', function(el) { el.onclick = jumersPWM0; });
    pinModesEls('pin11', function(el) { el.onclick = jumersOneWire; });
    pinModesEls('pin12', function(el) { el.onclick = jumersGPIO; });
    
    if (window.location.href.split('?')[1]) {
        window.location.href.split('?')[1].split('&').forEach(function(el) {
            var radio = htmlEl(el.replace('=', '_')),
                param = htmlEl(el.split('=')[0]),
                paramVal = el.split('=')[1];
            
            if (radio && radio.type === "radio") {
                // enable element to click on it and disable back if needed
                var dis = radio.disabled;
                radio.disabled = false;
                radio.click();
                radio.disabled = dis;
            } else if (param && (param.type === "select-one" || param.type === "text")) {
                param.value = paramVal;
                param.onchange();
            }
        });
    } else {
        // All NC
        for (n = 3; n <= 6; n++)
            htmlEl('pin' + n + '_NC').click();

        for (n = 13; n <= 16; n++)
            htmlEl('pin' + n + '_NC').click();
        
        
        htmlEl('pin3pwm_NC').click();
        
        htmlEl('pin7_NC').click();
        htmlEl('pin8_NC').click();
        
        htmlEl('pin11_NC').click();
        htmlEl('pin12_NC').click();
    }

    addRelation();

    Object.defineProperty(pins, "isReadyToCode", {
        enumerable: false,
        writable: true
    });
    pins.isReadyToCode = true;
    updateCode();
}

// Default params

defaultParams = {
    'pin11_onewire_param_1': '1',

    'pin11_dht_param_1': 'DHT11',
    'pin12_dht_param_1': 'DHT11',

    'pin3_ADC_i_3_param_1': '0',
    'pin3_ADC_i_3_param_2': '100',
    'pin3_ADC_i_5_param_1': '0',
    'pin3_ADC_i_5_param_2': '100',
    'pin3_ADC_i_12_param_1': '0',
    'pin3_ADC_i_12_param_2': '100',

    'pin4_ADC_i_3_param_1': '0',
    'pin4_ADC_i_3_param_2': '100',
    'pin4_ADC_i_5_param_1': '0',
    'pin4_ADC_i_5_param_2': '100',
    'pin4_ADC_i_12_param_1': '0',
    'pin4_ADC_i_12_param_2': '100',

    'pin5_ADC_i_3_param_1': '0',
    'pin5_ADC_i_3_param_2': '100',
    'pin5_ADC_i_5_param_1': '0',
    'pin5_ADC_i_5_param_2': '100',
    'pin5_ADC_i_12_param_1': '0',
    'pin5_ADC_i_12_param_2': '100',

    'pin6_ADC_i_3_param_1': '0',
    'pin6_ADC_i_3_param_2': '100',
    'pin6_ADC_i_5_param_1': '0',
    'pin6_ADC_i_5_param_2': '100',
    'pin6_ADC_i_12_param_1': '0',
    'pin6_ADC_i_12_param_2': '100',
    
    'nc': ''
};

// Code generation
var pins = {};
var old_pins = {};

function updateCode() {
    if (pins.isReadyToCode) {
        var ret = generateCode(pins);
        htmlEl('code').innerHTML = ret.code;
    }
}
function updateRelations() {
    // prevent early call before pins obj are fully collected
    if (pins.isReadyToCode == true) {
        // compare to prevent bug with relation reseting 
        if (JSON.stringify(old_pins) !== JSON.stringify(pins)) {
            old_pins = pins;
            var rels = htmlCEl('relation');
            for (var i = 0; i < rels.length; i++)
                loadRelationContent(rels[i]);
        }
    }
}


// function openPage(ev) {
//     var target = ev ? ev.target.value : event.srcElement;
//     debugger
//     // обновляем вкладки пошагового руководства
//     // if (target == 2) createManualPages();
//     // аккуратно скрываем страницы что бы не сбросить svg
//     softPageSwitch(target);
// }
function softPageSwitch(open) {
    // обновляем вкладки пошагового руководства
    // аккуратно скрываем страницы что бы не сбросить svg
    var els = htmlCEl('page');
    for (var i = 0; i < els.length; i++) {
        var el = els[i];
        if (i == open) {
            el.style.overflow = null;
            el.style.position = null;
            el.style.opacity = 1;
            el.style.width = null;
            el.style.height = null;
            el.style.top = null;
        } else {
            el.style.overflow = 'hidden';
            el.style.position = 'absolute';
            el.style.opacity = 0;
            el.style.width = 0;
            el.style.height = 0;
            el.style.top = 0;
        }
    }
}

function openTab(ev) {
    // Tabcontrol part
    var i, target, tabcontent, tablinks;
    target = 'manual_tab_' + ev.target.value;

    tabcontent = htmlCEl("manual_tab");
    for (i = 0; i < tabcontent.length; i++)
        tabcontent[i].style.display = "none";

    tablinks = htmlCEl("manual_tablink");
    for (i = 0; i < tablinks.length; i++)
        tablinks[i].classList.remove('manual_active');

    htmlEl(target).style.display = "flex";
    ev.srcElement.classList.add('manual_active');

    // SVG display part
    var currentTarget = parseInt(target);
    if (currentTarget > 1) {
        var deviceType = getDeviceType(currentTarget);

        svgdGen(-1, null, false);
        svgdGen(currentTarget, deviceType, true);
    } else {
        svgdGen(-1, null, false);
    }
}

function connectDoorlockButton(id, isConnect) {
    if (isConnect) {
        svgEl('leg_' + id + 'b_doorlock', 'obj_2').style.display = 'block';
    } else if (!isConnect) {
        svgEl('leg_' + id + 'b_doorlock', 'obj_2').style.display = 'none';
    }
}

function connectAmplifier(isConnect) {
    if (isConnect) {
        svgEl('layer5', 'obj_2').style.display = "block";
    } else if (!isConnect) {
        svgEl('layer5', 'obj_2').style.display = "none";  
    }
}

function getDeviceType(i) {
    if ((pins[i]['params']['1'] == 'red' || pins[i]['params']['1'] == 'green' ||
         pins[i]['params']['1'] == 'blue' || pins[i]['params']['1'] == 'white') && 
         (pins[13]['params']['1'] == 'white') && (pins[i]['params']['1'] != 'single'))
        return 'RGBWLED';

    else if ((pins[i]['params']['1'] == 'red' || pins[i]['params']['1'] == 'green' ||
              pins[i]['params']['1'] == 'blue') && (pins[13]['params']['1'] != 'white') &&
              (pins[i]['params']['1'] != 'single'))
        return 'RGBLED';

    if (i == 11 && pins[11]['type'] == 'DS18B20') return 'DS18B20';
    if (i == 3 && pins[i]['type'] == "SwitchMultilevelPWM0") return 'dimmer';
    if (pins[i]['params']['4'] == 'kPa') return 'pressure';
    if ((pins[i]['type'] == 'SwitchBinary') && (pins[i]['params']['1'] == 'doorlock')) return 'doorlock';
    if (pins[i]['type'] == 'RS485') return 'RS485';
    if (pins[i]['type'] == 'UART') return 'UART';

    return pins[i]['params']['1'];
}

function svgdGen(pinNum, deviceType, display) {
    var anyDevice = false;

    // this arrays contains current selected legs for device. This will be helpful when we want hide layer of device
    var buttonLegs = [], 
        pressureLegs = [],
        contactorLegs = [],
        motionLegs = [],
        reedSensor = [],
        LED = [],
        RGBLED = [],
        RGBWLED = [],
        doorLock = [];
    
    if ((pinNum >= 3 && pinNum <=8) || (pinNum >= 11 && pinNum <= 16)) {
        var mode = pins[pinNum]['type'],
            pin  = 'pin' + pinNum;
        var vmode = params[pin].split('_')[1];

        // Dimmer 0-10V
        if (pinNum == 3 && deviceType == "dimmer") {
            if ((pins[3]['type'] == 'SwitchMultilevelPWM0') && display) {
                svgEl('layer6', 'obj_2').style.display = "block";
            }
        } else {
            svgEl('layer6', 'obj_2').style.display = "none";
        }

        // RS485
        if ((pinNum == 7 || pinNum == 8) && deviceType == "RS485") {
            if ((pins[pinNum]['type'] == 'RS485') && display)
                svgEl('layer18', 'obj_2').style.display = "block";
        } else {
            svgEl('layer18', 'obj_2').style.display = "none";
        }

        // UART
        if ((pinNum == 7 || pinNum == 8) && deviceType == "UART") {
            if ((pins[pinNum]['type'] == 'UART') && display)
                svgEl('layer15', 'obj_2').style.display = "block";
        } else {
            svgEl('layer15', 'obj_2').style.display = "none";
        }
        

        // DS18B20
        if (pinNum == 11 && deviceType == "DS18B20") {
            if ((pins[pinNum]['type'] == 'DS18B20') && display)
                svgEl('layer13', 'obj_2').style.display = "block";
        } else {
            svgEl('layer13', 'obj_2').style.display = "none";
        }

        // DHT
        if (pinNum == 11 || pinNum == 12 && (deviceType == "DHT11" || deviceType == "DHT22")) {
            if ((pins[pinNum]['type'] == 'DHT') && display) {
                svgEl('layer14', 'obj_2').style.display = "block";
                svgEl('leg_pin' + pinNum + '_DHT', 'obj_2').style.opacity = 1;
            } else if (pins[pinNum]['type'] != 'DHT') 
                svgEl('leg_pin' + pinNum + '_DHT', 'obj_2').style.opacity = 0;
        } else {
            svgEl('layer14', 'obj_2').style.display = "none";
        }       

        // Pressure
        if (pinNum >= 3 && pinNum <= 6 && deviceType == "pressure") {
            if (pins[pinNum]['type'] == 'SensorMultilevel' && pins[pinNum]['params']['4'] == "kPa" && display) {
                svgEl('layer1', 'obj_2').style.display = "block";
                svgEl('leg_pin' + pinNum + '_pressure', 'obj_2').style.opacity = 1;

                pressureLegs.push(pinNum);
            }

            for (var i = 3; i <= 6; i++) {
                if (i == pinNum) continue;
                if (i in pressureLegs) pressureLegs = -1;
                
                svgEl('leg_pin' + i + '_pressure', 'obj_2').style.opacity = 0;
            }
        }

        // Motion sensor
        if (pinNum >= 3 && pinNum <= 6 && deviceType == "motion") {
            if (pins[pinNum]['type'] == 'SensorBinary' && pins[pinNum]['params']['1'] == "motion" && display) {
                svgEl('layer17', 'obj_2').style.display = "block";
                svgEl('leg_pin' + pinNum + '_motionSensor', 'obj_2').style.display = "block";
 
                motionLegs.push(pinNum);
            }

            for (i = 3; i <= 6; i++) {
                if (i == pinNum) continue;
                if (i in motionLegs) motionLegs = -1;
                
                svgEl('leg_pin' + i + '_motionSensor', 'obj_2').style.display = "none";
            }
        }

        // Buttons
        if (((pinNum >= 3 && pinNum <= 8) || pinNum == 11 || pinNum == 12) && deviceType == "general") {
            if ((pins[pinNum]['type'] == 'SensorBinary') && (pins[pinNum]['params']['1'] == 'general') && display) {        
                svgEl('layer7', 'obj_2').style.display = "block";
                svgEl('leg_pin' + pinNum + '_button', 'obj_2').style.opacity = 1;

                buttonLegs.push(pinNum);
            }

            for (i = 3; i <= 12; i++) {
                if (i == 9) i = 11; // these pins can't be used for button connect
                if (i == pinNum) continue;
                if (i in buttonLegs) buttonLegs = -1;
                
                svgEl('leg_pin' + i + '_button', 'obj_2').style.opacity = 0;
            }

            svgEl('12v_gnd_button', 'obj_2').style.display = "none";
            svgEl('5v_gnd_button', 'obj_2').style.display = "none";
            svgEl('3v_gnd_button', 'obj_2').style.display = "none";
            svgEl('free_gnd_button', 'obj_2').style.display = "block";
            if (pins[pinNum]['params'][3] == "normal") {
                if (vmode == 3) {
                    svgEl('3v_gnd_button', 'obj_2').style.display = "block";

                } else if (vmode == 5) {
                    svgEl('5v_gnd_button', 'obj_2').style.display = "block";
                } else if (vmode == 12) {
                    svgEl('12v_gnd_button', 'obj_2').style.display = "block";
                }
            }
        }

        // Contactor
        if (!((pinNum == 3) && (pins[3]['type'] == "SwitchMultilevelPWM0")) && (deviceType == "switch")) {
            if ((pins[pinNum]['type'] == 'SwitchBinary') && (pins[pinNum]['params']['1'] == 'switch') && display) {
                svgEl('layer12', 'obj_2').style.display = 'block';
                svgEl('leg_pin' + pinNum + '_contactor', 'obj_2').style.display = 'block';
             
                contactorLegs.push(pinNum);
            }

            for (i = 3; i <= 16; i++) {
                if (i == 9) i = 11; // these pins can't be used
                if (i == pinNum) continue;
                if (i in contactorLegs) contactorLegs = -1;
             
                svgEl('leg_pin' + i + '_contactor', 'obj_2').style.display = 'none';
            }
        }

        // Reed Sensor
        if ((pinNum >= 3 && pinNum <= 12) && deviceType == "door") {
            if ((pins[pinNum]['type'] == 'SensorBinary') && (pins[pinNum]['params']['1'] == 'door') && display) {        
                svgEl('layer9', 'obj_2').style.display = "block";
                svgEl('leg_pin' + pinNum + '_reedSensor', 'obj_2').style.opacity = 1;

                reedSensor.push(pinNum);
            }

            for (i = 3; i <= 12; i++) {
                if (i == 9) i = 11; // pins 9-10 can't be used in reed sensor
                if (i == pinNum) continue;
                if (i in reedSensor) reedSensor = -1;

                svgEl('leg_pin' + i + '_reedSensor', 'obj_2').style.opacity = 0;
            }
        }

        // Door Lock
        if (pinNum >= 13 && pinNum <= 16 && deviceType == "doorlock") {
            if ((pins[pinNum]['type'] == 'SwitchBinary') && (pins[pinNum]['params']['1'] == 'doorlock') && display) {        
                svgEl('layer20', 'obj_2').style.display = "block";
                svgEl('leg_' + pinNum + '_doorlock', 'obj_2').style.display = 'block';
                svgEl('leg_' + pinNum + 'b_doorlock', 'obj_2').style.display = 'block';

                doorLock.push(pinNum);
            }

            for (i = 13; i <= 16; i++) {
                if (i == pinNum) continue;
                if (i in doorLock) doorLock = -1;

                svgEl('leg_' + i + '_doorlock', 'obj_2').style.display = 'none';
                svgEl('leg_' + i + 'b_doorlock', 'obj_2').style.display = 'none';
            }
        }

        // White LED strip
        if (pinNum >= 13 && pinNum <= 16 && (deviceType == "single")) {
            if ((pins[pinNum]['type'] == 'SwitchMultilevel') && (pins[pinNum]['params']['1'] == 'single') && display) {
                svgEl('layer3', 'obj_2').style.display = 'block';
                svgEl('leg_pin' + pinNum + '_led', 'obj_2').style.display = 'block';

                LED.push(pinNum);
            }

            for (i = 13; i <= 16; i++) {
                if (i == pinNum) continue; 
                if (i in LED) LED = -1;
                
                svgEl('leg_pin' + i + '_led', 'obj_2').style.display = 'none';
            }
        }

        // RGB LED strip
        if (pinNum >= 14 && pinNum <= 16 && (deviceType == "RGBLED")) {
            if ((pins[pinNum]['type'] == 'SwitchMultilevel') && (pins[pinNum]['params']['1'] == 'red' || 
                pins[pinNum]['params']['1'] == 'green' || pins[pinNum]['params']['1'] == 'blue') && display) {

                svgEl('layer4', 'obj_2').style.display = 'block';
                svgEl('leg_pin' + pinNum + '_rgbled', 'obj_2').style.display = 'block';

                RGBLED.push(pinNum);
            }

            for (i = 14; i <= 16; i++) {
                if (i == pinNum) continue;
                if (i in RGBLED) RGBLED = -1;
                
                svgEl('leg_pin' + i + '_rgbled', 'obj_2').style.display = 'none';
            }
        }

        // RGBW LED strip
        if (pinNum >= 13 && pinNum <= 16 && (deviceType == "RGBWLED")) {
            if ((pins[pinNum]['type'] == 'SwitchMultilevel') && (pins[pinNum]['params']['1'] == 'red' || 
                pins[pinNum]['params']['1'] == 'green' || pins[pinNum]['params']['1'] == 'blue'|| 
                pins[pinNum]['params']['1'] == 'white') && display) {

                svgEl('layer8', 'obj_2').style.display = 'block';
                svgEl('leg_pin' + pinNum + '_rgbwled', 'obj_2').style.display = 'block';

                RGBWLED.push(pinNum);
            }

            for (var i = 13; i <= 16; i++) {
                if (i == pinNum) continue;
                if (i in RGBWLED) RGBWLED = -1;

                svgEl('leg_pin' + i + '_rgbwled', 'obj_2').style.display = 'none';                    
            }
        }
        
    // hide all layers if we get pinNum with -1 value
    } else if (pinNum == -1) { 
        for (var i = 1; i <= 20; i++) {
            if (i == 10) i = 11; // z-uno + powersupply
            if (i == 15) i = 17; // unexist
            if (i == 19) i = 20; // jumpers
            svgEl('layer' + i, 'obj_2').style.display = 'none';
        }
    }

    for (var i = 3; i <= 16; i++) {
        if (i > 8 && i < 11) i = 11; 

        // this try need to prevent early calling pins 
        try { if (pins[i]['type'] != 'NC') anyDevice = true; } catch(e) { Error(e) }

    }

    // hide if no one leg doesn't connected
    if (buttonLegs.length == 0 || (deviceType == "general" && !display)) {
        svgEl('layer7', 'obj_2').style.display = "none";
    }
    if (contactorLegs.length == 0 || (deviceType == "switch" && !display)) {
        svgEl('layer12', 'obj_2').style.display = "none";
    }
    if (reedSensor.length == 0 || (deviceType == "door" && !display)) {
        svgEl('layer9', 'obj_2').style.display = "none";
    }
    if (pressureLegs.length == 0 || (deviceType == "Pressure" && !display)) {
        svgEl('layer1', 'obj_2').style.display = "none";
    }
    if (doorLock.length == 0 || (deviceType == "doorlock" && !display)) {
        svgEl('layer20', 'obj_2').style.display = "none";
    }
    if (motionLegs.length == 0 || (deviceType == "motion" && !display)) {
        svgEl('layer17', 'obj_2').style.display = "none";
    }


    if (!LED.length || (deviceType == "single" && !display)) 
        svgEl('layer3', 'obj_2').style.display = "none";

    if (!RGBLED.length || (deviceType == "RGBLED" && !display))
        svgEl("layer4", "obj_2").style.display = "none";

    if (!RGBWLED.length || (deviceType == "RGBWLED" && !display))
        svgEl("layer8", "obj_2").style.display = "none";

    // power supply
    svgEl('layer11', 'obj_2').style.display = anyDevice ? "block" : "none";
}

// Issue with tabs for pin 3
// Issue with tabs for pin 3
function createManualPages() {
    for (var i = 0; i <= 16; i++) {
        if (i < 2) {
            htmlEl('manual_tablink_' + i).onclick = openTab;
            generateContentOfTab(i);
            continue;
        }
        if (i == 9) i = 11;
        try {   
            if (pins[i]['type'] != 'NC') {
                var pin_label = getPinLabelByNum(i);
                if (!htmlEl('manual_tablink_' + i)) {
                    var bu = document.createElement('button');
                    bu.classList.add('manual_tablink');
                    bu.id = 'manual_tablink_' + i;
                    bu.onclick = openTab;
                    bu.innerText = pin_label;
                    htmlEl('manual_tablinks').appendChild(bu);
                }
                if (!htmlEl('manual_tab_' + i)) {
                    var div = document.createElement('div');
                    div.classList.add('manual_tab');
                    div.id = 'manual_tab_' + i;
                    htmlEl('manual_tabs').appendChild(div);
                }
                generateContentOfTab(i);
            } else if (pins[i]['type'] == 'NC' && htmlEl('manual_tab_' + i)) {
                htmlEl('manual_tablink_' + i).remove();
                htmlEl('manual_tab_' + i).remove();
            }
        } catch(e) {  }
    }
}

function getPinLabelByNum(i) {
    switch(i) {
        case 3:
            return "ADC0 / 0-10V / PWM0"
        case 4:
            return "ADC1"
        case 5:
            return "ADC2"
        case 6:
            return "ADC3"
        case 7:
            return "7, RS-A"
        case 8:
            return "8, RS-B"
        case 11:
            return "11, One Wire"
        case 12:
            return "12"
        case 13:
            return "PWM1"
        case 14:
            return "PWM2"
        case 15:
            return "PWM3"
        case 16:
            return "PWM4"
        default:
            return i
    }
}

function generateContentOfTab(i) {
    if (i < 2) return;

    var pin_label = getPinLabelByNum(i),
        type = pins[i]['type'],
        prms = function (parameter) { return pins[i]['params'][parameter]; },
        content;

    // Pressure
    if (prms(4) == 'kPa')
        createpinpage(i, 'step_pressure');
    // Buttons
    else if ((type == 'SensorBinary') && (prms(1) == 'general')) 
        createpinpage(i, 'step_buttons');
    // RS485
    else if (type == 'RS485') 
        createpinpage(i, 'step_RS485');
    // UART
    else if (type == 'UART') 
        createpinpage(i, 'step_UART');
    // Valve
    else if (prms(1) == 'valve') 
        createpinpage(i, 'step_valve');
    // Siren
    else if (prms(1) == 'siren') 
        createpinpage(i, 'step_siren');
    // THERMOSTAT
    else if (prms(1) == "heatingThermostat" || prms(1) == "coolingThermostat") 
        createpinpage(i, 'step_thermostat');
    // DS18B20
    else if (type == 'DS18B20')
        createpinpage(i, 'step_DS18B20');
    // DHT
    else if (type == 'DHT')
        createpinpage(i, 'step_DHT');
    // Contactor
    else if ((type == 'SwitchBinary') && (prms(1) == 'switch'))
        createpinpage(i, 'step_contactor');
    // Reed Sensor
    else if ((type == 'SensorBinary') && (prms(1) == 'door'))       
        createpinpage(i, 'step_reed');
    // doorlock
    else if ((type == 'SwitchBinary') && (prms(1) == 'doorlock'))
        if (i >= 13 && i <= 16)
            content = '<div class="manual_type_select">\
                                        <button class="manual_tablinks_off manual_tablink"\
                                                onclick="event, connectDoorlockButton('+ i +', false)">\
                                                Without button</button>\
                                        <button class="manual_tablinks_on manual_tablink"\
                                                onclick="event, connectDoorlockButton('+ i +', true)">\
                                                With button</button>\
                                    </div>\
                                    <h3>Step for ' + pin_label + '</h3>\
                                    <p class="manual_step_p_'+ i +'">' + updatePagesContent("step_doorlock_button", i) + '</p>';
        else
            createpinpage(i, 'step_doorlock');
            
    // White LED
    else if (prms(1) == 'single')
        content = '<div class="manual_type_select">\
                                        <button class="manual_tablinks_off manual_tablink"\
                                                onclick="event, connectAmplifier(false)">\
                                                Without amplifier</button>\
                                        <button class="manual_tablinks_on manual_tablink"\
                                                onclick="event, connectAmplifier(true)">\
                                                With amplifier</button>\
                                     </div>\
                                     <h3>Step for ' + pin_label + '</h3>\
                                     <p class="manual_step_p_'+ i +'">' + updatePagesContent("step_white_led", i) + '</p>';
    // RGB LED strip
    else if (type == 'SwitchMultilevel' && pins[13]['params']['1'] != 'white')
        content = '<div class="manual_type_select">\
                                        <button class="manual_tablinks_off manual_tablink"\
                                                onclick="event, connectAmplifier(false)">\
                                                Without amplifier</button>\
                                        <button class="manual_tablinks_on manual_tablink"\
                                                onclick="event, connectAmplifier(true)">\
                                                With amplifier</button>\
                                     </div>\
                                     <h3>Step for ' + pin_label + '</h3>\
                                     <p class="manual_step_p_'+ i +'">' + updatePagesContent("step_rgb_led", i) + '</p>';
    // RGBW LED strip
    else if (type == 'SwitchMultilevel' && pins[13]['params']['1'] == 'white')
        content = '<div class="manual_type_select">\
                                        <button class="manual_tablinks_off manual_tablink"\
                                                onclick="event, connectAmplifier(false)">\
                                                Without amplifier</button>\
                                        <button class="manual_tablinks_on manual_tablink"\
                                                onclick="event, connectAmplifier(true)">\
                                                With amplifier</button>\
                                     </div>\
                                     <h3>Step for ' + pin_label + '</h3>\
                                     <p class="manual_step_p_'+ i +'">' + updatePagesContent("step_rgbw_led", i) + '</p>';
    
    if (content) htmlEl("manual_tab_" + i).innerHTML = content;
}
function createpinpage(i, name) {
    var h = document.createElement('h3'),
        p = document.createElement('p');
    h.innerHTML = ' Step for ' + getPinLabelByNum(i);
    p.innerHTML = updatePagesContent(name, i);
    p.classList.add('manual_step_p_' + i);
    htmlEl("manual_tab_" + i).innerHTML = h.outerHTML + p.outerHTML;
}
function updatePagesContent(page, pin) {
    var res;

    if (pin < 2)
        return pagesContent[page]; 

    var notes = ("\n" + generateCode(pins).notes + "\n").replace(/\n-([^\n]*)\n/g, '$&').split('\n').filter(function(v){return v.length > 0})
    var note_pinnum = generateCode(pins).keys.split(',').indexOf(pin+"")

    res = page in pagesContent ? pagesContent[page] : "";

    if (notes[note_pinnum])
        res += "<br><hr class='manual_note_hr'>" +
               "<i>" + notes[note_pinnum] + "</i>";
    return res;
}

pagesContent = {
    'step_0': 'Copy the sketch below and use Arduino IDE to burn it in your Z-Uno',
    'step_1': 'Insert Z-Uno in the Shield. Put the Shield in the DIN rail (pic. 1) or in the waterproof case (pic. 2)\
                <table border="0"><tbody>\
                    <tr>\
                        <td>\
                            <img src="/wa-data/public/photos/66/15/1566/1566.970.jpg" style="width: 100%;" alt="Z-Uno Shield in Sealed Case">\
                        </td>\
                        <td>\
                            <img src="/wa-data/public/photos/65/15/1565/1565.970.jpg" style="width: 100%;" alt="Z-Uno Shield in DIN-rail case">\
                        </td>\
                    </tr>\
                </tbody></table>',
    'step_white_led': 'Include ground of single color strip.',
    'step_rgb_led': 'Connect: <br>\tRed -> PWM4(pin16); <br>Green -> PWM3(pin15); <br>Blue -> PWM2(pin14).',
    'step_rgbw_led': 'Connect: <br>\tRed -> PWM4(pin16); <br>Green -> PWM3(pin15); <br>Blue -> PWM2(pin14); <br>White -> PWM1(pin13).',
    'step_buttons': 'Connect one side of button pins to GND and another to chosen pin.',
    'step_DS18B20': 'Connect middle leg of DS18B20 to pin #11 and add power supply 3V',
    'step_contactor': 'Connect logical pin of contactor to digital ouput',
    'step_pressure': 'Connect pressure sensor',
    'step_doorlock': 'Connect doorlocks.<br>\tConnection examples you can see on PWM pins.<br>\t',
    'step_doorlock_button': 'Connect doorlocks.<br>\tConnection examples you can see on PWM pins.<br>\tIf you use button, don\'t forget select accordly radio-button above.',
    'step_RS485': 'Connect RS485',
    'step_UART': 'Connect UART',
    'step_DHT': 'Connect DHT',
    'step_siren': 'Connect siren',
    'step_valve': 'Connect valve',
    'step_thermostat': 'Follow instructions'
};

function collapseAction(event) {
    this.classList.toggle("collapsible_active");
    var content = this.nextElementSibling;
    if (content.style.maxHeight)
      content.style.maxHeight = null;
    else
      content.style.maxHeight = content.scrollHeight + "px";
 
    content.scrollIntoView({block: "center", behavior: "smooth"});
}

//Returns true if it is a DOM node
function isNode(o){
  return (
    typeof Node === "object" ? o instanceof Node : 
    o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName==="string"
  );
}

//Returns true if it is a DOM element    
function isElement(o) {
    return (
        typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
            o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName === "string"
    );
}

  /**
   * Quick object check - this is primarily used to tell
   * Objects from primitive values when we know the value
   * is a JSON-compliant type.
   */
  function isObject (obj) {
    return obj !== null && typeof obj === 'object'
  }
  
// Issue with ADC0 - don't work page creation for this pin after reload page
