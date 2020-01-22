var conditions = {
	'>': ">",
	'<': "<",
	'>=': ">=",
	'<=': "<=",
	'0xFF': "turned on",
	'0x00': "turned off"
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
};
var boolean_answer = ["Yes", "No"];
// TODO: arr to {src:val} 
var default_state = ["Select sensor", "Select device"];
// list with all selected pins and their types
var pins_relationtypes = {};
// elements wich forming relation - select, input etc
var relelems = {};

// follow add relation button
// htmlEl("add_relation_button").onclick = eventHandler;

function eventHandler() {
	if (event.isTrusted) {
		if (evscmp(/relation/, event))
			relation = findParentRelation(event.srcElement);
		// определяем вызывающий элемент по классу
		switch (true) {
			case evscmp(/collapsible/, event):
				findRelationEl(relation);
				if (evscmp(/relation_advanced_button/, event))
					collapseRelationEl(event, relelems.advanced.content);
				else
					collapseAction(event);
				break;

			case evscmp(/relation_remove_button/, event):
				// removeRelation(relation);
				updateCode(pins);
				break;

			case evscmp(/relation_.*_input/, event) && (event.type == 'blur' || event.type == 'focus'):
				findRelationEl(relation);
				if (event.srcElement.value == 'value') {
					event.srcElement.value = "";
					event.srcElement.style.color = "#000";
				} else if (event.srcElement.value == '') {
					event.srcElement.value = 'value';
					event.srcElement.style.color = "#bbb";
				}
				
				// 0-100
				if (evscmp(/relation_swmul_input/, event) && event.srcElement.value != 'value' && event.srcElement.value != '') {
					var val = relelems.device.input.value;
					if (val != 'value' || val != '') {
						// remove non digit chars
						if (val.match(/\D/))
							val = val.match(/[^\D]+/);
						if (val > 99) relelems.device.input.value = 255;
					}
				}

				findRelationEl(findParentRelation(event.srcElement));
				updateRelationDependencies();
				updateCode(pins);
				break;

			case (evscmp(/relation_.*_select/, event) || evscmp(/relation_.*_input/, event)) && (event.type == "change"):
				findRelationEl(findParentRelation(event.srcElement));
				updateRelationDependencies();
				updateCode(pins);
				break;
		}
		updateCode(pins);
	}
}

function collapseRelationEl(event, content) {
	event.srcElement.classList.toggle("collapsible_active");
	if (content.style.maxHeight) {
		content.style.maxHeight = null;
	} else {
		content.style.maxHeight = content.scrollHeight + "px";
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
		};

		for (var i = 3; i <= 16; i++) {
			if (i == 9) i = 11;
			var pin_type = pins[i]['type'];

			if (pin_type != 'NC') {
				for (var cc in pin_types)
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
		mode_sb = relelems.mode.select;


	if (sensor_sb.childNodes.length !== 0) {
		removeOptions(ds18b20_sb);
	}

	// default
	// default_state.forEach(function (state) {
	// 	var opt = document.createElement('option');
	// 	opt.innerHTML = state;
	// 	opt.value = 'default_state';
	// 	switch (state) {
	// 		case 'Select sensor':
	// 			for (i = 0; i < sensor_sb.options.length; i++)
	// 				if (sensor_sb.options[i] == opt)
	// 					continue;
	// 				else
	// 					sensor_sb.appendChild(opt);
	// 			break;
	// 		case 'Select device':
	// 			for (i = 0; i < device_sb.options.length; i++)
	// 				if (device_sb.options[i] == opt)
	// 					continue;
	// 				else
	// 					device_sb.appendChild(opt);
	// 			break;
	// 	}
	// });

	// sensors
	for (var pin in pins_relationtypes.sensor) {
		if (sensor_sb.options)
		var opt = document.createElement('option');
		opt.innerHTML = pins_relationtypes.sensor[pin] + ' [' + pin + ']';
		opt.value = pins_relationtypes.sensor[pin];
		sensor_sb.appendChild(opt);
	}
	// ds18b20
	if (pins[11]['type'] === 'DS18B20') {
		for (var i = 1; i <= pins[11]["params"][1]; i++) {
			var opt = document.createElement('option');
			opt.innerHTML = i;
			opt.value = i;
			ds18b20_sb.appendChild(opt);
		}
	}
	// DHT
	for (var state in dht_states) {
		var opt = document.createElement('option');
		opt.innerHTML = dht_states[state];
		opt.value = state;
		dht_sb.appendChild(opt);
	}
	// condition
	for (var condition in conditions) {
		var opt = document.createElement('option');
		opt.innerHTML = conditions[condition];
		opt.value = condition;
		condition_sb.appendChild(opt);
	}
	// devices
	for (var pin in pins_relationtypes.device) {
		var opt = document.createElement('option');
		opt.innerHTML = pins_relationtypes.device[pin] + ' [' + pin + ']';
		opt.value = pins_relationtypes.device[pin];
		device_sb.appendChild(opt);
	}
	// modes
	for (var mode in modes) {
		var opt = document.createElement('option');
		opt.innerHTML = modes[mode];
		opt.value = mode;
		mode_sb.appendChild(opt);
	}
}


function updateRelationDependencies() {
	var sensor_sb = relelems.sensor.select,
		ds18b20_sb = relelems.ds18b20.select,
		dht_sb = relelems.dht.select,
		condition_sb = relelems.condition.select,
		device_sb = relelems.device.select,
		mode_sb = relelems.mode.select,
		condition_input = relelems.condition.input,
		device_input = relelems.device.input;
	var els = [ relelems.sensor.select, relelems.device.select, relelems.ds18b20.select, 
		relelems.dht.select, relelems.condition.select, relelems.mode.select, 
		relelems.condition.input, relelems.device.input ];
	
	els.forEach(function(el, i) { if (i > 1) el.style.display = 'none'; });
	// *default
	if (sensor_sb.value.indexOf('default_state') > -1) {
		condition_sb.style.display = 'none';
		condition_input.style.display = 'none';
		ds18b20_sb.style.display = 'none';
	// *binary
	} else if (sensor_sb.value.indexOf('SensorBinary') > -1) {
		for (var i = 0; i < condition_sb.options.length; i++)
			if (i > 3)
				condition_sb.options[i].style.display = 'block';
			else
				condition_sb.options[i].style.display = 'none';

		dht_sb.style.display = 'none';
		ds18b20_sb.style.display = 'none';
		condition_input.style.display = 'none';
		condition_sb.style.display = 'block';
		// manual update selected index
		if (!([4,5].includes(condition_sb.selectedIndex))) condition_sb.selectedIndex = 4;
	// *multilevel
	} else {
		for (var i = 0; i < condition_sb.options.length; i++)
			if (i < 4)
				condition_sb.options[i].style.display = 'block';
			else
				condition_sb.options[i].style.display = 'none';

		// elements
		if (sensor_sb.selectedOptions[0].value == "DS18B20")
			ds18b20_sb.style.display = 'block';
		else
			ds18b20_sb.style.display = 'none';

		if (sensor_sb.selectedOptions[0].value == "DHT")
			dht_sb.style.display = 'block';
		else
			dht_sb.style.display = 'none';

		condition_sb.style.display = 'block';
		condition_input.style.display = 'block';
		// manual update selected index
		if (([4,5].includes(condition_sb.selectedIndex))) condition_sb.selectedIndex = 0;
	}

	// device -> mode 
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
	findRelationEl(relation);
	// load content
	loadRelationContent(relation);
	// subcribe
	var condition_input = relelems.condition.input,
		device_input = relelems.device.input
		// collapse_button = relelems.advanced.button,
		// remove_button = relelems.local.remove;
		// TODO: organize
	// var els = [relelems.sensor.select, relelems.ds18b20.select]

	// remove_button.onclick = eventHandler;
	// collapse_button.onclick = eventHandler;
	device_input.onfocus = eventHandler;
	device_input.onblur = eventHandler;
	device_input.onchange = eventHandler;
	condition_input.onfocus = eventHandler;
	condition_input.onblur = eventHandler;
	condition_input.onchange = eventHandler;
	var relation_select = relation.getElementsByTagName('select');
	for (var i = 0; i < relation_select.length; i++) {
		relation_select[i].onchange = eventHandler;
		relation_select[i].onclick = eventHandler;
	}
	relation.classList.replace('relation_hidden', 'relation');
}

// function removeRelation(relation) {
// 	relation.remove();
// }

// _____ // HELPERS \\ _____ \\
function removeOptions(selectbox) {
	for (var i = 0; i < selectbox.options.length; i++)
		selectbox.options[i].remove();
}
function evscmp(regex, ev, selector) {
	if (selector == 'id')
		return !!regex.exec(ev.srcElement.id);
	else
		return !!regex.exec(ev.srcElement.className);
}
function findParentRelation(el) {
	if (htmlEl('relations').contains(el)) {
		var DOM_rels = htmlCEl('relation');
		for (i = 0; i < DOM_rels.length; i++)
			if (DOM_rels[i].contains(el))
				return DOM_rels[i];
	}
}
function removeParentRelation(el) {
	findParentRelation(el).remove();
}

function findRelationEl(el) {
	// TODO: set var name according with project 
	if (typeof (el) == 'number') el = htmlCEl('relation')[el];

	relelems.local = {
		main: el.getElementsByClassName("relation_main")[0],
		// advanced: el.getElementsByClassName("relation_advanced")[0],
		// remove: el.getElementsByClassName("relation_remove_button")[0],
		notes: el.getElementsByClassName("relation_notes")[0]
	};
	relelems.sensor = {
		select: el.getElementsByClassName("relation_sensor_select")[0]
	};
	relelems.ds18b20 = {
		select: el.getElementsByClassName("relation_ds18b20_select")[0]
	};
	relelems.dht = {
		select: el.getElementsByClassName("relation_dht_select")[0]
	};
	relelems.condition = {
		select: el.getElementsByClassName("relation_condition_select")[0],
		input: el.getElementsByClassName("relation_conditionvalue_input")[0]
	};
	relelems.device = {
		select: el.getElementsByClassName("relation_device_select")[0],
		input: el.getElementsByClassName("relation_swmul_input")[0]
	};
	relelems.mode = {
		select: el.getElementsByClassName("relation_mode_select")[0]
	};
	// relelems.advanced = {
	// 	content: el.getElementsByClassName("relation_advanced_content")[0],
	// 	button: el.getElementsByClassName("relation_advanced_button")[0],
	// };
	return el;
}

function checkRelationsCorectness(_relation) {
	/**
	 * (((A === x1 || A === x2) && B !== x3) || A === x4) 
	 * &&
	 * (((C === x5) && D !== x3) || C === x6)
	 */
	var res = Object.values(_relation).map( function(r) {
		if ((((r.sensor_sb.value === "DS18B20" || 
						r.sensor_sb.value === "DHT") && 
							r.condition_input !== "value") ||
								r.sensor_sb.value === "SensorBinary") &&
								(((r.device_sb.value === "SwitchMultilevel") &&
										r.swmul_input !== "value") || 
											r.device_sb.value === "SwitchBinary")) 
												return r.disabled = false;
		
		return r.disabled = true;
	});
	return res;
}
