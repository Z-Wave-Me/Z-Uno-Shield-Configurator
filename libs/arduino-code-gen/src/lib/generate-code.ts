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
