/**
 * Feedback:
 *   baa@z-wave.me
 * 
 * TODO (should be completed before release)  
 *!    	- Сохранять значения установленных связей (например в урл)
 *!		  - Обрабатывать 3pwm
 *! 		- Обновление списков c устройствами для связей при изменении пинов
 *! 	  -	Оптимизация по каналам (использовать метод объявления из последних релизов компилятора) 
 *!     - Установить правильные пути для ассерта (svg,js,css...)
 *!		  -	Убедиться в отсутствии утечек памяти
 *					https://ru.vuejs.org/v2/cookbook/avoiding-memory-leaks.html
 * 
 * 
 * TODO (default) 
 ** 		- Пользовательские конфиг-параметры
 **     	-- Запись состояния датчика в EEPROM
 **     	-- ZUNO_SETUP_S2ACCESS
 ** 		- Сочетание клавиш на копирование кода из любой части приложения + временный банер с подсказкой
 **    	- Переключение страниц через v-transition
 * 
 *?     Совместимость с фибаро (Уточнить у Poltos)
 * 
 *			- Fast PWM
 *			- Добавить UART / RS
 *			- Если используются кейсы, где устройство на батарейках и необходимо управлять устройствами по уровню заряда, то:
 *					-- Сделать устройство спящим. Например: засыпать начнет после определенного заряда батареи (если это возможно). 
 *			- Представить в виде отдельных функций
 *        -- Обработчики 
 * 				-- Инициализацию через el.click() для дебага и валидации, по умолчанию состояние должно загружаться через vue 
 *      - Подсказки назначения для джамперов, при наведении
 *
 * 		  //Разобраться с zunoSendReport() (нужен ли после изменения состояния в связке)
 *      //Сделать баннер на вторую вкладку, исчезающий при создании первой связи. Содержание и необходимость в процессе.
 *      //External Interrupts
 *			//Добавить связь "заряд->действие над устройством"
 */

/** 
 * Инициализируем через команды:
 ** ret (return, currently we don't handle first loaded svg; after $mount Vue DOM-obj in #app will be rerendered)
 ** vue (new Vue, create new Vue on 2nd loaded svg)
 ** config (loadConfiguration())
 */
var initialQueue = ['configure', 'ret', 'vue', 'ret'];
function initconf() {
  // vue.mount заменяет объекты, тем самым дважды генерируя события onload 
  // игнорируем первую загрузку объектов, после второй работаем
    if (!initialQueue) return;
    switch (initialQueue.pop()) {
      case 'ret': return;
      case 'vue': vue = initDefaultVueInstance(); return;
      case 'configure': loadConfiguration(); return;
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
        snackbar: {
          display: false,
          color: 'info',
        },
        code: {
          display: false,          
          editable: false,
        },
        fab: null
      }
    },
    methods: {
      resetConfig: ()=>{ if (confirm('Are you sure to clear the configuration?')) window.location.href = window.location.href.split('?')[0]; },
      copyURL: function () { this.$copyText(window.location.href).then(()=>{ showSnack(true, 'Success! Link copied') }, ()=>{ showSnack(false) }); },
      copyCode: function () { this.$copyText(code.textContent).then(()=>{ showSnack(true, 'Success! Code copied') }, ()=>{ showSnack(false) }); },
      changeCodeEditMode: function () { this.codeEditModeDisabled = !this.codeEditModeDisabled },
      openPage: function () { softPageSwitch(this.pages.active) }
    },
    mounted: function () {
      this.$nextTick(function () {
        this.openPage();
      })
    },
  });
}

// снэки вызываются подобно alert(), первый аргумент означает результат события TODO: улучшить вывод не бинарных событий и причины ошибки
function showSnack(result, msg) { if (typeof result !== "boolean") vue.snackbar.color = 'info'; else vue.snackbar.color = result ? "success":"error"; vue.snackbar.msg = msg; vue.snackbar.display = true; }