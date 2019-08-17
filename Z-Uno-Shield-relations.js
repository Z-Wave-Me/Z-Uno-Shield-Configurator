/*/ TODO list:
/ 		1. Сохранять значения установленных связей (например в урл)
/		2. Добавать открытую вкладку в урл
/ 		3. Вынести объекты в json
/		4. Добавить UART / RS
/		6. Обрабатывать DHT, 3pwm
/		7. Разобраться с zunoSendReport()
/
/*/ 

var conditions = {
	'>': ">",
	'<': "<",
	'>=': ">=",
	'<=': "<=",
	'0xFF': "Turn on",
	'0x00': "Turn off"
};
var pin_types = {
	SensorBinary: ["SensorBinary"],
	SensorMultilevel: ["SensorMultilevel", "DS18B20", "DHT"],
	SwitchBinary: ["SwitchBinary"],
	SwitchMultilevel: ["SwitchMultilevel", "SwitchMultilevelPWM0"],
	interface_types: ["UART", "RS485"]
};
var modes = {
	'0xFF': "Turn on",
	'0x00': "Turn off"
};
var dht_states = {
	temperature: "Temperature",
	humidity: "Humidity"
}
var boolean_answer = ["Yes", "No"];
var default_state = ["Select sensor", "Select device"];
// list with all selected pins and their types
var pins_relationtypes = {};
// elements wich forming relation - select, input etc
var relelems = {};

// follow add relation button
htmlEl("add_relation_button").onclick =	eventHandler;


function eventHandler(ev) {
	if (ev.isTrusted) {
		if (evscmp(/relation_.*_select/, ev) || evscmp(/relation_.*_input/, ev))
			findRelationEl(ev.srcElement.parentElement);
		// определяем вызывающий элемент по классу
		switch(true) {
			case evscmp(/remove_relation_button/, ev):
				removeRelation(ev);
				updateCode(pins)
				break;

			case evscmp(/add_relation_button/, ev):
				templatesToRelations(pinsToTemplates(pins));
				addRelation();
				break;


			case evscmp(/relation_.*_input/, ev) && (ev.type == 'blur' || ev.type == 'focus'):
				if (ev.srcElement.value == 'value') {
					ev.srcElement.value = "";
					ev.srcElement.style.color = "#000";
				} else if (ev.srcElement.value == '') {
					ev.srcElement.value = 'value';
					ev.srcElement.style.color = "#bbb";
				}
				// 0-100
				if (evscmp(/relation_swmul_input/, ev) && ev.srcElement.value != 'value' && ev.srcElement.value != '') {
					var val = relelems.device.input.value;
					if (val != 'value' || val != '') {
						// remove non digit chars
						if (val.match(/\D/))
							val = val.match(/[^\D]+/);
						if (val > 99) relelems.device.input.value = 255;
					}
				}

			case (evscmp(/relation_.*_select/, ev) || evscmp(/relation_.*_input/, ev)) && ev.type == "change":
				updateRelationDependencies(ev);
				updateCode(pins);
				break;
		}
	}
}

// add to tab onclick event
function loadRelationContent(relation) {
	// определяем соответсвующие списки для пинов 
	pinsType2relationsType();
	// заполняем выпадающие списки соответсвующими устройствами
	fillRelationSelectBoxes(relation);
}

function pinsType2relationsType() {
	try {
		pins_relationtypes = {
			sensor: {},
			device: {}
		}
	
	    for (var i = 3; i <= 16; i++) {
		    if (i == 9) i = 11;
			var pin_type = pins[i]['type'];
	
	        if (pin_type != 'NC') {
	        	for (cc in pin_types) 
	        		if (pin_types[cc].includes(pin_type))
		        		switch (cc) {
		        			case "SensorBinary":
		        			case "SensorMultilevel":
				        		pins_relationtypes.sensor[i] = pin_type;
				        		break;
		        			case "SwitchBinary":
		        			case "SwitchMultilevel":
				        		pins_relationtypes.device[i] = pin_type;
				        		break;
		        			case "interface_types":
		        				break;
		        			default:
			        			console.log('Unknown pin type: ' + pin_type);
			        			break;
		        		}
	    	}
	    }
	} catch (e) { console.log(e); }
}

function fillRelationSelectBoxes(relation) {
	findRelationEl(relation);

	var sensor_sb = relelems.sensor.select,
		ds18b20_sb = relelems.ds18b20.select,
		dht_sb = relelems.dht.select,
		condition_sb = relelems.condition.select,
		device_sb = relelems.device.select,
		mode_sb = relelems.mode.select,
		condition_input = relelems.condition.input,
		device_input = relelems.device.input;


	if (sensor_sb.childNodes.length !== 0) {
		removeOptions(sensor_sb);
		removeOptions(condition_sb);
		removeOptions(device_sb);
		removeOptions(mode_sb);
		removeOptions(ds18b20_sb);
	}
	
	// default
	default_state.forEach(function(state) {
	    var opt = document.createElement('option');
	    opt.innerHTML = state;
	    opt.value = 'default_state';
		switch(state) {
			case 'Select sensor':
			    sensor_sb.appendChild(opt);
				break;
			case 'Select device':
				device_sb.appendChild(opt);
				break;
		}
		
	});
	// sensors
	for (pin in pins_relationtypes.sensor) {
	    var opt = document.createElement('option');
	    opt.innerHTML = pins_relationtypes.sensor[pin] + ' [' + pin + ']';
	    opt.value = pins_relationtypes.sensor[pin];
	    sensor_sb.appendChild(opt);
	}
	// ds18b20
	if (pins[11]['type'] === 'DS18B20') {
		for (var i = 0; i < pins[11]["params"][1]; i++) {
			var opt = document.createElement('option');
			opt.innerHTML = opt.value = i + 1;
			ds18b20_sb.appendChild(opt)
		}
	}
	// DHT
	for (state in dht_states) {
	    var opt = document.createElement('option');
		opt.innerHTML = dht_states[state];
		opt.value = state;
		dht_sb.appendChild(opt);
	}
	// condition
	for (condition in conditions) {
	    var opt = document.createElement('option');
	    opt.innerHTML = conditions[condition];
	    opt.value = condition;
	    condition_sb.appendChild(opt);
	};
	// devices
	for (pin in pins_relationtypes.device) {
	    var opt = document.createElement('option');
	    opt.innerHTML = pins_relationtypes.device[pin] + ' [' + pin + ']';
	    opt.value = pins_relationtypes.device[pin];
	    device_sb.appendChild(opt);
	}
	// modes
	for (mode in modes) {
	    var opt = document.createElement('option');
	    opt.innerHTML = modes[mode];
	    opt.value = mode;
	    mode_sb.appendChild(opt);
	};
}


function updateRelationDependencies(ev) {
	var relation = ev.srcElement.parentElement;

	findRelationEl(relation);

	var sensor_sb = relelems.sensor.select,
		ds18b20_sb = relelems.ds18b20.select,
		dht_sb = relelems.dht.select,
		condition_sb = relelems.condition.select,
		device_sb = relelems.device.select,
		mode_sb = relelems.mode.select,
		condition_input = relelems.condition.input,
		device_input = relelems.device.input;

	// sensor -> condition 
	if (ev.srcElement.className.indexOf("_sensor_") > -1)
		// default
		if (sensor_sb.value.indexOf('default_state') > -1) {
			condition_sb.style.display = condition_input.style.display = ds18b20_sb.style.display = 'none';
		// binary
		} else if (sensor_sb.value.indexOf('SensorBinary') > -1) {
			// options
			for (var i = 0; i < condition_sb.options.length; i++) 
				if (i > 3) 
					condition_sb.options[i].style.display = 'block';
				else
					condition_sb.options[i].style.display = 'none';
			
			// elements
			dht_sb.style.display = 'none';
			ds18b20_sb.style.display = 'none';
			condition_input.style.display = 'none';
			condition_sb.style.display = 'block';
			condition_sb.selectedIndex = 4;
		// multilevel
		} else {
			// options
			for (var i = 0; i < condition_sb.options.length; i++)
				if (i < 4)
					condition_sb.options[i].style.display = 'block';
				else
					condition_sb.options[i].style.display = 'none';

			// elements
			if (ev.srcElement.selectedOptions[0].value === "DS18B20")
				ds18b20_sb.style.display = 'block';
			else
				ds18b20_sb.style.display = 'none';
			if (ev.srcElement.selectedOptions[0].value === "DHT")
				dht_sb.style.display = 'block';
			else
				dht_sb.style.display = 'none';

			condition_sb.style.display = 'block';
			condition_input.style.display = 'block';
			condition_sb.selectedIndex = 0;
		}
	
	// device -> mode 
	if (ev.srcElement.className.indexOf("_device_") > -1)
		if (device_sb.value.indexOf('default_state') > -1) {
			mode_sb.style.display = "none";
			device_input.style.display = "none";
		} else if (device_sb.value.indexOf('SwitchBinary') > -1) {
			mode_sb.style.display = "block";
			device_input.style.display = "none";
		} else {
			mode_sb.style.display = "none";
			device_input.style.display = "block";
		}

}

function addRelation() {
	// clone hidden element
	var relation = htmlEl('relations').appendChild(htmlCEl('relation_hidden')[0].cloneNode(true));
	// load content
	loadRelationContent(relation);
	// subcribe
	var relation_select = relation.getElementsByClassName('relation_select');
	// 
	findRelationEl(relation);
	var sensor_sb = relelems.sensor.select,
		ds18b20_sb = relelems.ds18b20.select,
		dht_sb = relelems.dht.select,
		condition_sb = relelems.condition.select,
		device_sb = relelems.device.select,
		mode_sb = relelems.mode.select,
		condition_input = relelems.condition.input,
		device_input = relelems.device.input;
	

	device_input.onfocus = eventHandler;
	device_input.onblur = eventHandler;
	device_input.onchange = eventHandler;
	condition_input.onfocus = eventHandler;
	condition_input.onblur = eventHandler;
	condition_input.onchange = eventHandler;
	for (var i = 0; i < relation_select.length; i++) {
		relation_select[i].onchange = eventHandler;
		relation_select[i].onclick = eventHandler;
	}
	relation.getElementsByClassName('remove_relation_button')[0].onclick = eventHandler;

	// show hidden element
	relation.classList.replace('relation_hidden', 'relation');
	generateCode(pins);
}

function removeRelation(ev) {
	ev.srcElement.parentElement.remove();
}

// _____ // HELPERS \\ _____ \\
function removeOptions(selectbox) {
    for (var i = selectbox.options.length; i >= 0 ; i--)
        selectbox.remove(i);
}
function evscmp(regex, ev, selector) {
	if (selector == 'id')
		return !!regex.test(ev.srcElement.id);
	else 
		return !!regex.test(ev.srcElement.className);
}
function findRelationEl(relation) {
	switch (typeof(relation)) {
		case typeof {}:
			relelems.sensor = { 
				select: relation.getElementsByClassName("relation_sensor_select")[0]
			};
			relelems.ds18b20 = {
				select: relation.getElementsByClassName("relation_ds18b20_select")[0]
			};
			relelems.dht = {
				select: relation.getElementsByClassName("relation_dht_select")[0]
			};
			relelems.condition = {
				select: relation.getElementsByClassName("relation_condition_select")[0],
				input: relation.getElementsByClassName("relation_conditionvalue_input")[0]
			};
			relelems.device = {
				select: relation.getElementsByClassName("relation_device_select")[0],
				input: relation.getElementsByClassName("relation_swmul_input")[0]
			};
			relelems.mode = {
				select: relation.getElementsByClassName("relation_mode_select")[0]
			}
			relelems.icon = {
				alert: relation.getElementsByClassName("alert_icon")[0]
			}
			break;
		case typeof 0:
			relelems.sensor = { 
				select: htmlCEl('relation')[relation].getElementsByClassName("relation_sensor_select")[0]
			};
			relelems.ds18b20 = {
				select: htmlCEl('relation')[relation].getElementsByClassName("relation_ds18b20_select")[0]
			};
			relelems.dht = {
				select: htmlCEl('relation')[relation].getElementsByClassName("relation_dht_select")[0]
			};
			relelems.condition = {
				select: htmlCEl('relation')[relation].getElementsByClassName("relation_condition_select")[0],
				input: htmlCEl('relation')[relation].getElementsByClassName("relation_conditionvalue_input")[0]
			};
			relelems.device = {
				select: htmlCEl('relation')[relation].getElementsByClassName("relation_device_select")[0],
				input: htmlCEl('relation')[relation].getElementsByClassName("relation_swmul_input")[0]
			};
			relelems.mode = {
				select: htmlCEl('relation')[relation].getElementsByClassName("relation_mode_select")[0]
			}
			relelems.icon = {
				alert: htmlCEl('relation')[relation].getElementsByClassName("alert_icon")[0]
			}
			break;
	}

  	return [ relelems.sensor.select, 	// 0
			 relelems.condition.select, // 1
			 relelems.device.select, 	// 2
			 relelems.mode.select, 		// 3
			 relelems.condition.input, 	// 4
			 relelems.device.input, 	// 5
			 relelems.icon.alert, 		// 6
			 relelems.ds18b20.select, 	// 7
			 relelems.dht.select ]	
}

function checkRelationsCorectness(_relation) {
	var length = Object.keys(_relation).length;
	var res = {
		ready: [],
		alert: []
	};
    for (var i = 0; i < length; i++) {
        var relel = findRelationEl(_relation[i].el);
        // sensor select
        if (relel[0].value === "default_state" || 
        		// sensor input
                (relel[4].value === "value" && relel[4].style.display !== 'none') ||
                	// debive select
                    relel[2].value === "default_state" || 
                    	// device input
                        (relel[5].value === "value" && relel[5].style.display !== 'none')) {
            relel[6].style.display = "block";
            _relation[i].disabled = true;
            res.alert.push(i);
        } else {
            relel[6].style.display = "none";
            _relation[i].disabled = false;
            res.ready.push(i);
        }
    }
    return res;
}