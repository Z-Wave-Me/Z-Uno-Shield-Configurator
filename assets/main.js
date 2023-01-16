/**
 * Belov Alexander
 *   @baadev
 *   baa@z-wave.me
 *
 */
let lastAdded;
var pins = {};
var old_pins = {};
var params = {};
// Default params
var defaultParams = {
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
var tabtitles = {
  0: 'Sketch',
  1: 'Enclosure',
  3: 'ADC0 / 0-10V / PWM0',
  4: 'ADC1',
  5: 'ADC2',
  6: 'ADC3',
  7: '7, RS-A',
  8: '8, RS-B',
  11: '11, OneWire',
  12: '12',
  13: 'PWM1',
  14: 'PWM2',
  15: 'PWM3',
  16: 'PWM4'
}

// when svg-objects are loaded asynchronously 
// we need to ignore first of them
var initialQueue = ['configure', 'return', 'vue', 'return'];

function initconf() {
  // vue.mount заменяет объекты, тем самым дважды генерируя события onload 
  switch (initialQueue.pop()) {
    case 'configure':
      loadConfiguration();
      return;
    case 'vue':
      vue = initDefaultVueInstance();
      return;
  }
};

function loadConfiguration() {
  // Attach handlers
  document.querySelectorAll('[id*=_param_]').forEach(el => el.onchange = updateParams);

  for (var n = 3; n <= 6; n++) pinModesEls('pin' + n, el => el.onclick = jumersADC);

  for (var n = 7; n <= 8; n++) pinModesEls('pin' + n, el => el.onclick = jumersUART);

  for (var n = 13; n <= 16; n++) pinModesEls('pin' + n, el => el.onclick = jumersPWM);

  pinModesEls('pin3pwm', el => el.onclick = jumersPWM0);
  pinModesEls('pin11', el => el.onclick = jumersOneWire);
  pinModesEls('pin12', el => el.onclick = jumersGPIO);

  var prms = window.location.href.split('?')[1] ? window.location.href.split('?')[1].split('&') : 0;
  if (prms.length >= 13) {
    prms.forEach(el => {
      var radio = htmlEl(el.replace('=', '_')), param = htmlEl(el.split('=')[0]), paramVal = el.split('=')[1];

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
    for (n = 3; n <= 8; n++) htmlEl('pin' + n + '_NC').click();
    for (n = 11; n <= 16; n++) htmlEl('pin' + n + '_NC').click();
    htmlEl('pin3pwm_NC').click();
  }

  Object.defineProperty(pins, "isReadyToCode", {
    enumerable: false, writable: true, value: true
  });

  updateCode();
}

// use function before loadConfiguration() may cause render errors 
var vue;

function initDefaultVueInstance() {
  return new Vue({
    el: '#application', vuetify: new Vuetify(),

    data: () => ({
      pages: {
        active: null,
      }, manual_tablinks: {
        current: null, title: {
          0: 'Sketch', 1: 'Enclosure'
        }, content: {
          0: 'Copy the sketch below and use Arduino IDE to burn it in your Z-Uno',
          1: 'Insert Z-Uno in the Shield. Put the Shield in the DIN rail (pic. 1) or in the waterproof case (pic. 2)',
          3: 'description ADC0 / 0-10V / PWM0',
          4: 'description ADC1',
          5: 'description ADC2',
          6: 'description ADC3',
          7: '7, RS-A',
          8: '8, RS-B',
          11: '11, OneWire',
          12: '12',
          13: 'PWM1',
          14: 'PWM2',
          15: 'PWM3',
          16: 'PWM4'
        }
      }, relation: {
        alert: false, count: null,
      }, code: {
        display: false, toolbar_color: 'success', text: null
      }, pins: {
        selected: []
      }, snackbar: {
        display: false, color: 'info',
      },
    }),

    methods: {
      resetConfig: () => {
        if (confirm('Are you sure to clear the configuration?')) window.location.search = '';
      }, copyURL: () => {
        vue.$copyText(window.location.href).then(() => showSnack(true, 'Success! Link copied'), () => showSnack(false));
      }, copyCode: () => {
        vue.$copyText(code.textContent).then(() => showSnack(true, 'Success! Code copied'), () => showSnack(false));
      }, openPage: function (page) {
        if ((this.pages.active === 1) && !this.relation.count) addRelation();

        if (this.pages.active === 2) updateTabs();

        softPageSwitch(page ? page : this.pages.active);
      }, downloadSketch: function () {
        var a = window.document.createElement('a');
        a.href = window.URL.createObjectURL(new Blob([('// ' + window.location.href + '\n' + this.code.text)]));
        a.download = 'ShieldConfigurator.ino';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    },

    mounted: function () {
      this.$nextTick(function () {
        this.openPage();
      })
    },
    directives: {
      highlightjs: {
        deep: true, bind: function (el, binding) {
          // on first bind, highlight all targets
          let targets = el.querySelectorAll('code')
          targets.forEach((target) => {
            // if a value is directly assigned to the directive, use this
            // instead of the element content.
            if (binding.value) {
              target.textContent = binding.value
            }
            hljs.highlightBlock(target)
          })
        }, componentUpdated: function (el, binding) {
          // after an update, re-fill the content and then highlight
          let targets = el.querySelectorAll('code')
          targets.forEach((target) => {
            if (binding.value) {
              target.textContent = binding.value
              hljs.highlightBlock(target)
            }
          })
        }
      }
    }
  });
}

// снэки вызываются подобно alert(), первый аргумент означает результат события TODO: улучшить вывод не бинарных событий и причины ошибки
function showSnack(result, msg) {
  if (typeof result !== "boolean") vue.snackbar.color = 'info'; else vue.snackbar.color = result ? "success" : "error";
  vue.snackbar.msg = msg;
  vue.snackbar.display = true;
}
