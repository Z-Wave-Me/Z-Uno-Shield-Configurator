  var initial = { 
    // vue.mount заменяет объекты, тем самым дважды генерируя события onload 
    // игнорируем первую загрузку объектов, после второй работаем
    queue: ['configure','ret','vue','ret'],
    load() {
      if (!this.queue) return;
      switch (this.queue.pop()) {
        case 'ret': return;
        case 'vue': newVueInstance(); return;
        case 'configure': loadConfiguration(); return;
      }
    }
  };

  var vue; 
  // don't use function before initial 
  function newVueInstance() {
    vue = new Vue({
      el: '#application',
      vuetify: new Vuetify(),
      methods: {
        resetConfig: function() { if (confirm('Are you sure to clear the configuration?')) window.location.href = window.location.href.split('?')[0]; },
        copyURL: function () { this.$copyText(window.location.href).then(function (e) { showSuccessSnack(e, 'Link') }, function (e) { showErrorSnack(e) }); },
        copyCode: function () { this.$copyText(code.textContent).then(function (e) { showSuccessSnack(e, 'Code') }, function (e) { showErrorSnack(e) }); },
        changeCodeEditMode: function () { this.codeEditModeDisabled = true }
      },
      data() {
        return {
          pages: null,
          manual_tablinks: {
            current: 0,
            title: {
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
            },
            content: {
              0: 'Copy the sketch below and use Arduino IDE to burn it in your Z-Uno',
              1: 'Insert Z-Uno in the Shield. Put the Shield in the DIN rail (pic. 1) or in the waterproof case (pic. 2)',
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
          },
          show_code: false,
          snackbar: {
            display: false,
            target: '',
            ev_status: 'Something went wrong',
            color: 'error',
          },
          codeDisabled: true,
          codeEditModeDisabled: true
        }
      },
      /*mounted: function() {
        this.$nextTick(function () {
          loadConfiguration()
        })
      },*/
    });
  }
  function showSuccessSnack(event, text, log) { vue.snackbar.target = text; vue.snackbar.ev_status = 'successfuly copied'; vue.snackbar.color = 'success'; vue.snackbar.display = true; if (log) console.log(this); };
  function showErrorSnack(e, text) { vue.snackbar.target = text ? text : ''; vue.snackbar.ev_status = 'Error, see logs for details'; vue.snackbar.color = 'error'; vue.snackbar.display = true; console.log(this); };