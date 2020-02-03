/**
 * Belov Alexander
 *   @baadev
 *   baa@z-wave.me
 * 
 */

function cat(msg) { console.log(msg) };

// sometime 2 svg-objects are loaded asynchronously
// so we need to ignore first of them
var initialQueue = ['configure','return', 'vue','return'];
function initconf() {
  // vue.mount заменяет объекты, тем самым дважды генерируя события onload 
    switch (initialQueue.pop()) {
      case 'configure': loadConfiguration(); return;
      case 'vue': vue = initDefaultVueInstance(); return;
    }
};

// use function before loadConfiguration() may cause render errors 
var vue;
function initDefaultVueInstance() {
  return new Vue({
    el: '#application',
    vuetify: new Vuetify(),
    data() {
      return {
        pages: {
          active: null,
        },
        manual_tablinks: {
          current: null,
          title: {
            0: 'Sketch',
            1: 'Enclosure'
          },
          content: {
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
        },
        relation: {
          alert: false,
          count: null,
        },
        code: {
          display: false,      
          toolbar_color: 'success',
          text: null
        },
        pins: {
          selected: []
        },
        snackbar: {
          display: false,
          color: 'info',
        },
        radio: '1'
      }
    },
    methods: {
      resetConfig: ()=>{ if (confirm('Are you sure to clear the configuration?')) window.location.href = window.location.href.split('?')[0]; },
      copyURL: function () { this.$copyText(window.location.href).then(()=>{ showSnack(true, 'Success! Link copied') }, ()=>{ showSnack(false) }); },
      copyCode: function () { this.$copyText(code.textContent).then(()=>{ showSnack(true, 'Success! Code copied') }, ()=>{ showSnack(false) }); },
      changeCodeEditMode: function () { this.codeEditModeDisabled = !this.codeEditModeDisabled },
      openPage: function (page) { if ((this.pages.active === 1) && !this.relation.count) addRelation();  if (this.pages.active === 2) updateTabs(); softPageSwitch(page ? page : this.pages.active); },
      downloadSketch: function () {
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
    }
  });
}

// снэки вызываются подобно alert(), первый аргумент означает результат события TODO: улучшить вывод не бинарных событий и причины ошибки
function showSnack(result, msg) { if (typeof result !== "boolean") vue.snackbar.color = 'info'; else vue.snackbar.color = result ? "success":"error"; vue.snackbar.msg = msg; vue.snackbar.display = true; }