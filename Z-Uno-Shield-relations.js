// TODO: добавать открытую вкладку в урл
// TODO: вынести объекты в json

const conditions = {
	greater: ">",
	less: "<",
	greater_or_equal: ">=",
	less_or_equal: "<=",
	on: "Turn on",
	off: "Turn off"
};
const boolean_answer = ["Yes", "No"];

const pin_types = {
	SensorBinary: ["SensorBinary"],
	SensorMultilevel: ["SensorMultilevel", "DS18B20", "DHT"],
	SwitchBinary: ["SwitchBinary"],
	SwitchMultilevel: ["SwitchMultilevel", "SwitchMultilevelPWM0"],
	interface_types: ["UART", "RS485"]
};
const modes = {
	on: "Turn on",
	off: "Turn off"
};
// list with all selected pins and their types
var pins_relationtypes = {};
// elements wich forming relation - select, input etc
var relelems = {};

// follow add relation button
htmlEl("add_relation_button").onclick =	eventHandler;


function eventHandler(ev) {
	if (ev.isTrusted) {
		// определяем вызывающий элемент по классу
		switch(true) {
			// break не нужен, так как может потребоваться дальнейшая обработка
			case evscmp('_select', ev):
				updateRelationDependencies(ev);

			case evscmp('relation_device_select', ev):
				return;

			case evscmp('relation_sensor_select', ev):
				return;

			case evscmp('remove_relation_button', ev):
				removeRelation(ev);
				return;

			case evscmp('add_relation_button', ev):
				addRelation();
				// checkRelationCorectness();
					return;

			case evscmp('relation_swmul_input', ev) && ev.type == 'focus':
				if (ev.srcElement.value === 'value') {
					ev.srcElement.value = "";
					ev.srcElement.style.color = "#000";
				}
				return;

			case evscmp('relation_swmul_input', ev) && ev.type == 'blur':
				if (ev.srcElement.value === '') {
					ev.srcElement.value = "value";
					ev.srcElement.style.color = "#bbb";
				}
				return;
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
	pins_relationtypes = {
		sensor: ["Select sensor"],
		device: ["Select device"]
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
			        		pins_relationtypes.sensor.push(pin_type + " [" + i + "]");
			        		break;
	        			case "SwitchBinary":
	        			case "SwitchMultilevel":
			        		pins_relationtypes.device.push(pin_type + " [" + i + "]");
			        		break;
	        			case "interface_types":
	        				break;
	        			default:
		        			console.log('error');
		        			break;
	        		}
    	}
    }
}

function fillRelationSelectBoxes(relation) {
	findRelationEl(relation);

	var sensor_sb = relelems.sensor.select,
		condition_sb = relelems.condition.select,
		device_sb = relelems.device.select,
		mode_sb = relelems.mode.select;

	if (sensor_sb.childNodes.length !== 0) {
		removeOptions(sensor_sb);
		removeOptions(condition_sb);
		removeOptions(device_sb);
		removeOptions(mode_sb);
	}
	
	// sensors
	pins_relationtypes.sensor.forEach(function(pin_type) {
	    var opt = document.createElement('option');
	    opt.innerHTML = pin_type;
	    opt.value = pin_type;
	    sensor_sb.appendChild(opt);
	});
	// condition
	for (condition in conditions) {
	    var opt = document.createElement('option');
	    opt.innerHTML = conditions[condition];
	    opt.value = condition;
	    condition_sb.appendChild(opt);
	};
	// devices
	pins_relationtypes.device.forEach(function(pin_type) {
	    var opt = document.createElement('option');
	    opt.innerHTML = pin_type;
	    opt.value = pin_type;
	    device_sb.appendChild(opt);
	});
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
		condition_sb = relelems.condition.select,
		device_sb = relelems.device.select,
		mode_sb = relelems.mode.select,
		condition_input = relelems.condition.input,
		swmul_input = relelems.device.input;

	// sensor -> condition 
	if (ev.srcElement.className.indexOf("_sensor_") > -1)
		// default
		if (sensor_sb.value.indexOf('Select sensor') > -1) {
			condition_sb.style.display = condition_input.style.display = 'none';
		// binary
		} else if (sensor_sb.value.indexOf('SensorBinary') > -1) {
			// options
			for (var i = 0; i < condition_sb.options.length; i++) 
				if (i > 3) 
					condition_sb.options[i].style.display = 'block';
				else
					condition_sb.options[i].style.display = 'none';
			
			// elements
			condition_input.style.display = 'none';
			condition_sb.style.display = 'block';
			condition_sb.selectedIndex = 4;
			condition_input.disabled = true;
			condition_input.value = "255";
		// multilevel
		} else {
			// options
			for (var i = 0; i < condition_sb.options.length; i++)
				if (i < 4)
					condition_sb.options[i].style.display = 'block';
				else
					condition_sb.options[i].style.display = 'none';

			// elements
			condition_sb.style.display = 'block';
			condition_input.style.display = 'block';
			condition_sb.selectedIndex = 0;
			condition_input.disabled = false;
			condition_input.value = "";
		}
	
	// device -> mode 
	if (ev.srcElement.className.indexOf("_device_") > -1)
		if (device_sb.value.indexOf('Select device') > -1) {
			mode_sb.style.display = "none";
			swmul_input.style.display = "none";
		} else if (device_sb.value.indexOf('SwitchBinary') > -1) {
			mode_sb.style.display = "block";
			swmul_input.style.display = "none";
		} else {
			mode_sb.style.display = "none";
			swmul_input.style.display = "block";
		}
}

// TODO
// function checkRelationCorectness() {
	
// 	var relation = htmlCEl('relation');

// 	for (var i = 0; i < relation.length; i++)
// 		findRelationEl(relation[i]);
// }

function addRelation() {
	// clone hidden element
	var relation = htmlEl('relations').appendChild(htmlCEl('relation')[0].cloneNode(true));
	// load content
	loadRelationContent(relation);
	// subcribe
	var relation_select = relation.getElementsByClassName('relation_select');
	var swmul_input = relation.getElementsByClassName('relation_swmul_input')[0];
	var condition_sb = relation.getElementsByClassName("relation_condition_select")[0];
	var condition_input = relation.getElementsByClassName("relation_conditionvalue_input")[0];

	swmul_input.onfocus = eventHandler;
	swmul_input.onblur = eventHandler;
	for (var i = 0; i < relation_select.length; i++) {
		relation_select[i].onchange = eventHandler;
		relation_select[i].onclick = eventHandler;
	}
	relation.getElementsByClassName('remove_relation_button')[0].onclick = eventHandler;

	// disable on 
	condition_sb.style.display = condition_input.style.display = 'none';
	// show hidden element
	relation.classList.remove('hidden');
}

function removeRelation(ev) {
	ev.srcElement.parentElement.remove();
}

// _____ // HELPERS \\ _____ \\
function removeOptions(selectbox) {
    for (var i = selectbox.options.length - 1; i >= 0 ; i--)
        selectbox.remove(i);
}
// сравнивает класс вызванного элемента со строкой и возвращает true, если она там есть
function evscmp(str, ev) {
	return ev.srcElement.className.indexOf(str) > -1;
}

function findRelationEl(relation) {
	relelems.sensor = { 
		select: relation.getElementsByClassName("relation_sensor_select")[0]
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

	return relelems;
}
