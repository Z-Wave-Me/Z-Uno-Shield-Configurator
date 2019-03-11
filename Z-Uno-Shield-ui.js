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

function copyText(text) {
    var dummy = document.createElement('textarea');

    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
}

// Saving settings

var params = {};
function updateSettings() {
    window.history.replaceState(null, null, 
        window.location.href.split('?')[0] + 
        '?' + 
        Object.keys(params).map(function(key) { return key + '=' + params[key]; }).join('&')
    );

    createManualPages();
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
        if (typeof index !== "number") return;
        params[paramObjs[index].id] = paramObjs[index].value;
    });
    
    updateSettings();
}

htmlEl('resetConfig').onclick = function() {
    if (confirm('Are you sure to clear the configuration?')) window.location.href = window.location.href.split('?')[0];
};

htmlEl('copyURL').onclick = function() {
    copyText(window.location.href);
};

htmlEl('copyCode').onclick = function() {
    copyText(htmlEl('code').textContent);
};

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
    createManualPages();
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
        svgEl('jumper_' + pin + '_io_3').style.fillOpacity = 1;
        svgEl('jumper_' + pin + '_i_5').style.fillOpacity = 0;
        svgEl('jumper_' + pin + '_i_12').style.fillOpacity = 0;
        svgEl('jumper_' + pin + '_i_5_12').style.fillOpacity = 0;
        svgEl('direction_' + pin + '_o').style.opacity = (mode === "o_3") ? 1 : 0;
        svgEl('direction_' + pin + '_i').style.opacity = (mode === "o_3") ? 0 : 1;
        svgEl('type_' + pin + '_analog').style.opacity = (mode === "ADC_i_3") ? 1 : 0;
        svgEl('type_' + pin + '_digital').style.opacity = (mode === "ADC_i_3") ? 0 : 1;


        svgEl('jumper_' + pin + '_io_3', 'obj_2').style.fillOpacity = 1;
        svgEl('jumper_' + pin + '_i_5', 'obj_2').style.fillOpacity = 0;
        svgEl('jumper_' + pin + '_i_12', 'obj_2').style.fillOpacity = 0;
        svgEl('jumper_' + pin + '_i_5_12', 'obj_2').style.fillOpacity = 0;
    } else if (mode === "ADC_i_5" || mode === "i_5") {
        svgEl('jumper_' + pin + '_io_3').style.fillOpacity = 0;
        svgEl('jumper_' + pin + '_i_5').style.fillOpacity = 1;
        svgEl('jumper_' + pin + '_i_12').style.fillOpacity = 0;
        svgEl('jumper_' + pin + '_i_5_12').style.fillOpacity = 1;
        svgEl('direction_' + pin + '_o').style.opacity = 0;
        svgEl('direction_' + pin + '_i').style.opacity = 1;
        svgEl('type_' + pin + '_analog').style.opacity = (mode === "ADC_i_5") ? 1 : 0;
        svgEl('type_' + pin + '_digital').style.opacity = (mode === "ADC_i_5") ? 0 : 1;

        svgEl('jumper_' + pin + '_io_3', 'obj_2').style.fillOpacity = 0;
        svgEl('jumper_' + pin + '_i_5', 'obj_2').style.fillOpacity = 1;
        svgEl('jumper_' + pin + '_i_12', 'obj_2').style.fillOpacity = 0;
        svgEl('jumper_' + pin + '_i_5_12', 'obj_2').style.fillOpacity = 1;
    } else if (mode === "ADC_i_12" || mode === "i_12") {
        svgEl('jumper_' + pin + '_io_3').style.fillOpacity = 0;
        svgEl('jumper_' + pin + '_i_5').style.fillOpacity = 0;
        svgEl('jumper_' + pin + '_i_12').style.fillOpacity = 1;
        svgEl('jumper_' + pin + '_i_5_12').style.fillOpacity = 1;
        svgEl('direction_' + pin + '_o').style.opacity = 0;
        svgEl('direction_' + pin + '_i').style.opacity = 1;
        svgEl('type_' + pin + '_analog').style.opacity = (mode === "ADC_i_12") ? 1 : 0;
        svgEl('type_' + pin + '_digital').style.opacity = (mode === "ADC_i_12") ? 0 : 1;

        svgEl('jumper_' + pin + '_io_3', 'obj_2').style.fillOpacity = 0;
        svgEl('jumper_' + pin + '_i_5', 'obj_2').style.fillOpacity = 0;
        svgEl('jumper_' + pin + '_i_12', 'obj_2').style.fillOpacity = 1;
        svgEl('jumper_' + pin + '_i_5_12', 'obj_2').style.fillOpacity = 1;
    } else if (mode === "NC") {
        svgEl('jumper_' + pin + '_io_3').style.fillOpacity = 0;
        svgEl('jumper_' + pin + '_i_5').style.fillOpacity = 0;
        svgEl('jumper_' + pin + '_i_12').style.fillOpacity = 0;
        svgEl('jumper_' + pin + '_i_5_12').style.fillOpacity = 0;
        svgEl('direction_' + pin + '_o').style.opacity = 0;
        svgEl('direction_' + pin + '_i').style.opacity = 0;
        svgEl('type_' + pin + '_analog').style.opacity = 0;
        svgEl('type_' + pin + '_digital').style.opacity = 0;

        svgEl('jumper_' + pin + '_io_3', 'obj_2').style.fillOpacity = 0;
        svgEl('jumper_' + pin + '_i_5', 'obj_2').style.fillOpacity = 0;
        svgEl('jumper_' + pin + '_i_12', 'obj_2').style.fillOpacity = 0;
        svgEl('jumper_' + pin + '_i_5_12', 'obj_2').style.fillOpacity = 0;
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
        svgEl('jumper_' + pin).style.fillOpacity = 1;
        svgEl('jumper_' + pin, 'obj_2').style.fillOpacity = 1;

        svgEl('direction_' + pin + '_o').style.opacity = 1;
        svgEl('type_' + pin + '_pwm').style.opacity = 1;
        htmlElsEna('pin3', false);
        htmlEl('pin3_disabled').style.display = 'block';
    } else if (mode === "NC") {
        svgEl('jumper_' + pin).style.fillOpacity = 0;
        svgEl('jumper_' + pin, 'obj_2').style.fillOpacity = 0;

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
        svgEl('jumper_RS485_A').style.fillOpacity = 0;
        svgEl('jumper_RS485_B').style.fillOpacity = 0;
        svgEl('jumper_CTRL_RS485').style.fillOpacity = 0;

        svgEl('jumper_RX_UART', 'obj_2').style.opacity = 1;
        svgEl('jumper_TX_UART', 'obj_2').style.opacity = 1;
        svgEl('jumper_RX_RS485', 'obj_2').style.opacity = 0;
        svgEl('jumper_TX_RS485', 'obj_2').style.opacity = 0;
        svgEl('jumper_RS485_A', 'obj_2').style.fillOpacity = 0;
        svgEl('jumper_RS485_B', 'obj_2').style.fillOpacity = 0;
        svgEl('jumper_CTRL_RS485', 'obj_2').style.fillOpacity = 0;

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
        svgEl('jumper_RS485_A').style.fillOpacity = 1;
        svgEl('jumper_RS485_B').style.fillOpacity = 1;
        svgEl('jumper_CTRL_RS485').style.fillOpacity = 1;

        svgEl('jumper_RX_UART', 'obj_2').style.opacity = 0;
        svgEl('jumper_TX_UART', 'obj_2').style.opacity = 0;
        svgEl('jumper_RX_RS485', 'obj_2').style.opacity = 1;
        svgEl('jumper_TX_RS485', 'obj_2').style.opacity = 1;
        svgEl('jumper_RS485_A', 'obj_2').style.fillOpacity = 1;
        svgEl('jumper_RS485_B', 'obj_2').style.fillOpacity = 1;
        svgEl('jumper_CTRL_RS485', 'obj_2').style.fillOpacity = 1;

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
        svgEl('jumper_RS485_A').style.fillOpacity = 0;
        svgEl('jumper_RS485_B').style.fillOpacity = 0;
        svgEl('jumper_CTRL_RS485').style.fillOpacity = 0;
        
        svgEl('jumper_RX_RS485', 'obj_2').style.opacity = 0;
        svgEl('jumper_TX_RS485', 'obj_2').style.opacity = 0;
        svgEl('jumper_RS485_A', 'obj_2').style.fillOpacity = 0;
        svgEl('jumper_RS485_B', 'obj_2').style.fillOpacity = 0;
        svgEl('jumper_CTRL_RS485', 'obj_2').style.fillOpacity = 0;

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
        svgEl('jumper_RS485_A').style.fillOpacity = 0;
        svgEl('jumper_RS485_B').style.fillOpacity = 0;
        svgEl('jumper_CTRL_RS485').style.fillOpacity = 0;

        svgEl('jumper_RX_RS485', 'obj_2').style.opacity = 0;
        svgEl('jumper_TX_RS485', 'obj_2').style.opacity = 0;
        svgEl('jumper_RS485_A', 'obj_2').style.fillOpacity = 0;
        svgEl('jumper_RS485_B', 'obj_2').style.fillOpacity = 0;
        svgEl('jumper_CTRL_RS485', 'obj_2').style.fillOpacity = 0;
        
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

// Attach handlers

for (var n = 3; n <= 6; n++)
    pinModesEls('pin' + n, function(el) { el.onclick = jumersADC; });
for (var n = 7; n <= 8; n++)
    pinModesEls('pin' + n, function(el) { el.onclick = jumersUART;});
for (var n = 13; n <= 16; n++)
    pinModesEls('pin' + n, function(el) { el.onclick = jumersPWM; });
pinModesEls('pin3pwm', function(el) { el.onclick = jumersPWM0; });
pinModesEls('pin11', function(el) { el.onclick = jumersOneWire; });
pinModesEls('pin12', function(el) { el.onclick = jumersGPIO; });

document.querySelectorAll('[id*=_param_]').forEach(function(el) { el.onchange = updateParams; });

function loadConfiguration() {
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
        
        for (var n = 3; n <= 6; n++) {
            htmlEl('pin' + n + '_NC').click();
        }
        
        for (var n = 13; n <= 16; n++) {
            htmlEl('pin' + n + '_NC').click();
        }
        
        htmlEl('pin3pwm_NC').click();
        
        htmlEl('pin7_NC').click();
        htmlEl('pin8_NC').click();
        
        htmlEl('pin11_NC').click();
        htmlEl('pin12_NC').click();
    }
}

// Default
htmlEl('obj').onload = function() {
    document.getElementsByClassName('zoom_svg')[0].onclick = function() {
        var flex = parseFloat(this.parentNode.style.flexGrow);
        if (!flex) flex = 1;
        
        if (flex < 1.9) flex += 0.3;
        else flex = 1;
        
        this.parentNode.style.flexGrow = flex;
    };
}

htmlEl('obj_2').onload = function() {
    ['pin3pwm', 'pin3', 'pin4', 'pin5', 'pin6', 'pin7', 'pin8', 'pin11', 'pin12', 'pin13', 'pin14', 'pin15', 'pin16'].forEach(function(pin) {
        htmlEl('settings_' + pin).onmouseover = function() {
            svgEl('connector_' + pin).style.fill = 'yellow';
            svgEl('connector_' + pin, 'obj_2').style.fill = 'yellow';
        };
        htmlEl('settings_' + pin).onmouseout = function() {
            svgEl('connector_' + pin).style.fill = '#358800';
            svgEl('connector_' + pin, 'obj_2').style.fill = '#358800';
        };
    });
    
    loadConfiguration();
};

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

function updateCode() {
    var ret = generateCode(pins);
    htmlEl('code').innerHTML = ret.code;
    htmlEl('notes').innerHTML = ("\n" + ret.notes + "\n").replace(/\n-([^\n]*)\n/g, '\n<li>$1</li>\n');
}


function openTab(evt, tab) {
    // Tabcontrol part
    var i, tabcontent, tablinks;

    tabcontent = htmlCEl("manual_tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = htmlCEl("manual_tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" manual_active", "");
    }

    htmlEl(tab).style.display = "block";
    evt.currentTarget.className += " manual_active";

    // SVG display part
    var currentTarget = parseInt(tab.replace(/[^0-9\.]/g, ''), 10);
    if (currentTarget > 1) {
        var deviceType = getDeviceType(currentTarget);

        svgdGen(-1, null, false);
        svgdGen(currentTarget, deviceType, true);
    }

    createManualPages();
}

function amplifierInclude(include) {
    if (include) {
        svgEl('layer5', 'obj_2').style.display = "block";
    } else if (!include) {
        svgEl('layer5', 'obj_2').style.display = "none";  
    }
}

function getDeviceType(i) {
    if ((pins[i]['params']['1'] == 'red' || pins[i]['params']['1'] == 'green' || pins[i]['params']['1'] == 'blue' || pins[i]['params']['1'] == 'white') && (pins[13]['params']['1'] == 'white') && (pins[i]['params']['1'] != 'single')) {
        return 'RGBWLED'
    } else if ((pins[i]['params']['1'] == 'red' || pins[i]['params']['1'] == 'green' || pins[i]['params']['1'] == 'blue') && (pins[13]['params']['1'] != 'white') && (pins[i]['params']['1'] != 'single')) {
        return 'RGBLED'
    }

    if (i == 11 && pins[11]['type'] == 'DS18B20') return 'DS18B20';
    if (pins[i]['params']['4'] == 'kPa') return 'pressure';

    return pins[i]['params']['1'];
}

function svgdGen(pinNum, deviceType, display) {
    var anyDevice = false;

    var buttonLegs = [], // this arrays contains current selected legs for device. This will be helpful when we want hide layer of device
        pressureLegs = [],
        contactorLegs = [],
        reedSensor = [],
        LED = [],
        RGBLED = [],
        RGBWLED = [],
        pressureLegs = [],
        LEDStrip = false;

        if ((pinNum >= 3 && pinNum <=8) || (pinNum >= 11 && pinNum <= 16)) {
        var mode = pins[pinNum]['type'],
            pin  = 'pin' + pinNum;

        // Pressure
        if (pinNum >= 3 && pinNum <= 6 && deviceType == "pressure") {
            if (pins[pinNum]['type'] == 'SensorMultilevel' && pins[pinNum]['params']['4'] == "kPa" && display) {
                svgEl('layer6', 'obj_2').style.display = "block";
                svgEl('leg_pin' + pinNum + '_pressure', 'obj_2').style.opacity = 1;

                pressureLegs.push(pinNum);
            }

            for (var i = 3; i <= 6; i++) {
                if (i == pinNum) continue;
                if (i in pressureLegs) pressureLegs = -1;
                
                svgEl('leg_pin' + i + '_pressure', 'obj_2').style.opacity = 0;
            }
        }

        // Buttons
        if (((pinNum >= 3 && pinNum <= 8) || pinNum == 11 || pinNum == 12) && deviceType == "general") {
            if ((pins[pinNum]['type'] == 'SensorBinary') && (pins[pinNum]['params']['1'] == 'general') && display) {        
                svgEl('layer7', 'obj_2').style.display = "block";
                svgEl('leg_pin' + pinNum + '_button', 'obj_2').style.opacity = 1;

                buttonLegs.push(pinNum);
            }

            for (var i = 3; i <= 12; i++) {
                if (i == 9) i = 11; // these pins can't be used for button connect
                if (i == pinNum) continue;
                if (i in buttonLegs) buttonLegs = -1;
                
                svgEl('leg_pin' + i + '_button', 'obj_2').style.opacity = 0;
            }
        }

        // DS18B20
        if (pinNum == 11 && deviceType == "DS18B20") {
            if ((pins[11]['type'] == 'DS18B20') && display) {
                svgEl('layer13', 'obj_2').style.display = "block";
                svgEl('layer13', 'obj_2').style.display = "block";
            } else if (!display) {
                svgEl('layer13', 'obj_2').style.display = "none";
            }
        }

        // DHT
        if (pinNum == 11 || pinNum == 12 && (deviceType == "DHT11" || deviceType == "DHT22")) {
            if ((pins[pinNum]['type'] == 'DHT') && display) {
                svgEl('layer14', 'obj_2').style.display = "block";
                svgEl('leg_pin' + pinNum + '_DHT', 'obj_2').style.opacity = 1;
            } else if (pins[pinNum]['type'] != 'DHT') {
                svgEl('leg_pin' + pinNum + '_DHT', 'obj_2').style.opacity = 0;
            }

            if (!display) {
                svgEl('layer14', 'obj_2').style.display = "none";
            }            
        }

        // Contactor
        if (pinNum >= 13 && pinNum <= 16 && (deviceType == "switch")) {
            if ((pins[pinNum]['type'] == 'SwitchBinary') && (pins[pinNum]['params']['1'] == 'switch') && display) {
                svgEl('layer12', 'obj_2').style.display = 'block';
                svgEl('leg_pin' + pinNum + '_contactor', 'obj_2').style.display = 'block';
             
                contactorLegs.push(pinNum);
            }

            for (var i = 13; i <= 16; i++) {
                if (i == pinNum) continue;
                if (i in contactorLegs) contactorLegs = -1;
             
                svgEl('leg_pin' + i + '_contactor', 'obj_2').style.display = 'none';
            }
        }

        // Reed Sensor
        if (((pinNum >= 3 && pinNum <= 8) || pinNum == 11 || pinNum == 12) && deviceType == "door") {
            if ((pins[pinNum]['type'] == 'SensorBinary') && (pins[pinNum]['params']['1'] == 'door') && display) {        
                svgEl('layer9', 'obj_2').style.display = "block";
                svgEl('leg_pin' + pinNum + '_reedSensor', 'obj_2').style.opacity = 1;

                reedSensor.push(pinNum);
            }

            for (var i = 3; i <= 12; i++) {
                if (i == 9) i = 12; // pins 9-11 can't be used in reed sensor
                if (i == pinNum) continue;
                if (i in reedSensor) reedSensor = -1;

                svgEl('leg_pin' + i + '_reedSensor', 'obj_2').style.opacity = 0;
            }
        }

        // White LED strip
        if (pinNum >= 13 && pinNum <= 16 && (deviceType == "single")) {
            if ((pins[pinNum]['type'] == 'SwitchMultilevel') && (pins[pinNum]['params']['1'] == 'single') && display) {
                svgEl('layer3', 'obj_2').style.display = 'block';
                svgEl('leg_pin' + pinNum + '_led', 'obj_2').style.display = 'block';

                LED.push(pinNum);
            }

            for (var i = 13; i <= 16; i++) {
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

            for (var i = 14; i <= 16; i++) {
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
        

    } else if (pinNum == -1) { // hide all layers if we get pinNum with -1 value
        for (var i = 3; i <= 14; i++) {
            if (i == 10 || i == 11) i = 12; 
            svgEl('layer' + i, 'obj_2').style.display = 'none';
        }
    }

    for (var i = 3; i <= 16; i++) {
        if (i > 8 && i < 11) i = 11; 

        // this try need to prevent early calling pins P.S. try to use global boolean variable what will give access to this function only afler onload event  
        try { if (pins[i]['type'] != 'NC') anyDevice = true; } catch(e) {}

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
        svgEl('layer6', 'obj_2').style.display = "none";
    }

    if (LED.length == 0 || (deviceType == "single" && !display)) {
        svgEl('layer3', 'obj_2').style.display = "none";
    } else if (LED.length != 0) {
        LEDStrip = true;
    }
    if (RGBLED.length == 0 || (deviceType == "RGBLED" && !display)) {
        svgEl('layer4', 'obj_2').style.display = "none";
    } else if (RGBLED.length != 0) {
        LEDStrip = true;
    }
    if (RGBWLED.length == 0 || (deviceType == "RGBWLED" && !display)) {
        svgEl('layer8', 'obj_2').style.display = "none";
    } else if (RGBWLED.length != 0) {
        LEDStrip = true;
    }

    // Power supply select 
    if (anyDevice && !LEDStrip || (contactorLegs.length > 0)) { // if any device exists and device !LED we use small power supply  
        svgEl('layer1', 'obj_2').style.display = "none"
        svgEl('layer11', 'obj_2').style.display = "block";
    } else if (anyDevice && LEDStrip) { // if device is LED we use 180W power supply
        svgEl('layer11', 'obj_2').style.display = "none"
        svgEl('layer1', 'obj_2').style.display = "block"
    } else if (!anyDevice) {
        svgEl('layer1', 'obj_2').style.display = "none"
        svgEl('layer11', 'obj_2').style.display = "none";
    }       
}

// Issue with tabs for pin 3
function createManualPages() {
    var countOfButtons = htmlEl("manual_pages_control").getElementsByTagName("button").length;

    for (var i = 3; i <= 16; i++) {
        if (i == 9) i = 11;

        try {   // this need to prevent early calling pins P.S. try to use global boolean variable what will give access to this function only afler onload event  
            if (pins[i]['type'] != 'NC' && !htmlEl('manual_page_' + i)) {
                countOfButtons++;
                // add button
                $("#manual_pages_control").append('<button class="manual_tablinks" id="manual_control_button_' + i + '" onclick="openTab(event, \'manual_page_' + i + '\')">' + 'pin #' + i + '</button>');
                // add page content
                $("#manual_pages").append('<div id="manual_page_' + i + '" class="manual_tabcontent">');
                $("#manual_page_" + i).append('<h3>Step for pin#' + i + '</h3>');
                $("#manual_pages").append('</div>');

                generateContentOfTab(i);
            } else if (pins[i]['type'] == 'NC' && htmlEl('manual_page_' + i)) {
                $("#manual_control_button_" + i).remove();
                $("#manual_page_" + i).remove();
            } else if (pins[i]['type'] != 'NC') {
                generateContentOfTab(i);
            }

            countOfButtons = htmlEl("manual_pages_control").getElementsByTagName("button").length;
        } catch(e) {}
    }
}

function generateContentOfTab(i) {
    if (htmlCEl("manual_step_p_" + i).length == 0) {
        if (pins[i]['params']['4'] == 'kPa') { // Pressure
            $("#manual_page_" + i).append('<p class="manual_step_p_'+ i +'">' + pagesContent["step_pressure"] + '</p>');

        } else if ((pins[i]['type'] == 'SensorBinary') && (pins[i]['params']['1'] == 'general')) { // Buttons
            $("#manual_page_" + i).append('<p class="manual_step_p_'+ i +'">' + pagesContent["step_buttons"] + '</p>');
        
        } else if (pins[i]['type'] == 'DS18B20') { // DS18B20
            $("#manual_page_" + i).append('<p class="manual_step_p_'+ i +'">' + pagesContent["step_DS18B20"] + '</p>');

        } else if (pins[i]['type'] == 'DHT') { // DHT
            $("#manual_page_" + i).append('<p class="manual_step_p_'+ i +'">' + pagesContent["step_DHT"] + '</p>');

        } else if ((pins[i]['type'] == 'SwitchBinary') && (pins[i]['params']['1'] == 'switch')) { // Contactor
            $("#manual_page_" + i).append('<p class="manual_step_p_'+ i +'">' + pagesContent["step_contactor"] + '</p>');

        } else if ((pins[i]['type'] == 'SensorBinary') && (pins[i]['params']['1'] == 'door')) { // Reed Sensor       
            $("#manual_page_" + i).append('<p class="manual_step_p_'+ i +'">' + pagesContent["step_reed"] + '</p>');

        } else if (pins[i]['params']['1'] == 'single') { // White LED
            $("#manual_page_" + i).prepend('<div id="manual_led_type_select"><button class="manual_tablinks_off" onclick="event, amplifierInclude(false)">Without amplifier</button><button class="manual_tablinks_on" onclick="event, amplifierInclude(true)">With amplifier</button></div>');
            $("#manual_page_" + i).append('<p class="manual_step_p_'+ i +'">' + pagesContent["step_white_led"] + '</p>');

        } else if (pins[i]['type'] == 'SwitchMultilevel' && pins[13]['params']['1'] != 'white') { // RGB LED strip
            $("#manual_page_" + i).prepend('<div id="manual_led_type_select"><button class="manual_tablinks_off" onclick="event, amplifierInclude(false)">Without amplifier</button><button class="manual_tablinks_on" onclick="event, amplifierInclude(true)">With amplifier</button></div>');
            $("#manual_page_" + i).append('<p class="manual_step_p_'+ i +'">' + pagesContent["step_rgb_led"] + '</p>');

        } else if (pins[i]['type'] == 'SwitchMultilevel' && pins[13]['params']['1'] == 'white') { // RGBW LED strip
            $("#manual_page_" + i).prepend('<div id="manual_led_type_select"><button class="manual_tablinks_off" onclick="event, amplifierInclude(false)">Without amplifier</button><button class="manual_tablinks_on" onclick="event, amplifierInclude(true)">With amplifier</button></div>');
            $("#manual_page_" + i).append('<p class="manual_step_p_'+ i +'">' + pagesContent["step_rgbw_led"] + '</p>');
        } 
    }
}

pagesContent = {
    'step_one': 'Burn the sketch in the Arduino IDE',
    'step_two': 'Put the Shield in the DIN rail (pic. 1) or in the waterproof case (pic. 2)',
    'step_white_led': 'Include ground of single color strip.',
    'step_rgb_led': 'Connect: <br>\tRed -> PWM4(pin16); <br>Green -> PWM3(pin15); <br>Blue -> PWM2(pin14).',
    'step_rgbw_led': 'Connect: <br>\tRed -> PWM4(pin16); <br>Green -> PWM3(pin15); <br>Blue -> PWM2(pin14); <br>White -> PWM1(pin13).',
    'step_buttons': 'Connect one side of button pins to GND and another to chosen pin.',
    'step_DS18B20': 'Connect middle leg of DS18B20 to pin #11 and add power supply 3V',
    'step_contactor': 'Connect logical pin of contactor to digital ouput',
    'step_pressure': 'Connect pressure sensor'
};

// Issue with ADC0 - don't work page creation for this pin after reload page