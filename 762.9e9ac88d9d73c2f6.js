"use strict";(self.webpackChunkconfigurator=self.webpackChunkconfigurator||[]).push([[762],{998:(y,m,r)=>{r.d(m,{F:()=>e,q:()=>u});var u=function(i){return i.PWM1="__c_code_here_1__",i.PWM2="__c_code_here_2__",i.PWM3="__c_code_here_3__",i.PWM4="__c_code_here_4__",i.V10_1="__c_code_here_5__",i.V10_2="__c_code_here_6__",i.V10_3="__c_code_here_7__",i.V10_4="__c_code_here_8__",i.RS_A="__c_code_here_9__",i.RS_B="__c_code_here_10__",i.PIN_12="__c_code_here_11__",i.ONE_WIRE="__c_code_here_12__",i.ADC0="__c_code_here_13__",i.ADC1="__c_code_here_14__",i.ADC2="__c_code_here_15__",i.ADC3="__c_code_here_16__",i}(u||{}),e=function(i){return i.Color="color",i.RS="[linked] rs",i.UART="[linked] uart",i}(e||{})},207:(y,m,r)=>{r.d(m,{h:()=>d});var u=r(8645),e=r(9773),i=r(5879),t=r(7065);let d=(()=>{var _;class g{get selected(){return this.currentPin===this.options?.id}constructor(a){this.pinSelectedService=a,this.destroy$=new u.x,this.pinSelectedService.selectObserver.pipe((0,e.R)(this.destroy$)).subscribe(h=>this.currentPin=h)}ngOnDestroy(){this.destroy$.next(),this.destroy$.complete()}}return(_=g).\u0275fac=function(a){return new(a||_)(i.Y36(t.V))},_.\u0275dir=i.lG2({type:_,selectors:[["","configuratorSelectable","","options",""]],hostVars:2,hostBindings:function(a,h){2&a&&i.ekj("pin-selected",h.selected)},inputs:{options:"options"},standalone:!0}),g})()},3917:(y,m,r)=>{r.d(m,{IO:()=>u});var u={};r.r(u),r.d(u,{adcConfig:()=>O,analogInput:()=>a,analogOutput:()=>g,colorOutput:()=>C,digitalInput:()=>d,digitalOutput:()=>_,ds18b20:()=>P,roter:()=>h,temperatureHumidity:()=>M});var e=r(151),i=r(6729),t=r(998);const d=[{title:$localize`General purpose`,value:"General purpose",type:e.Yi.SensorBinary},{title:$localize`Door/window`,value:"door",type:e.Yi.SensorBinary},{title:$localize`Motion`,value:"motion",type:e.Yi.SensorBinary},{title:$localize`Smoke`,value:"smoke",type:e.Yi.SensorBinary},{title:$localize`Leakage`,value:"leakage",type:e.Yi.SensorBinary},{title:$localize`CO`,value:"CO",type:e.Yi.SensorBinary},{title:$localize`CO2`,value:"CO2",type:e.Yi.SensorBinary},{title:$localize`Heat`,value:"heat",type:e.Yi.SensorBinary},{title:$localize`Freeze`,value:"freeze",type:e.Yi.SensorBinary},{title:$localize`Tamper`,value:"tamper",type:e.Yi.SensorBinary},{title:$localize`Tilt`,value:"tilt",type:e.Yi.SensorBinary},{title:$localize`Glass break`,value:"glass break",type:e.Yi.SensorBinary}].map(f=>({...f,withType:!0})),_=[{title:$localize`Switch`,value:"switch",type:e.Yi.SwitchBinary},{title:$localize`Door lock`,value:"doorLock",type:e.Yi.SwitchBinary},{title:$localize`Siren`,value:"siren",type:e.Yi.SwitchBinary},{title:$localize`Valve`,value:"valve",type:e.Yi.SwitchBinary},{title:$localize`Heating thermostat`,value:"heatingThermostat",type:e.Yi.Thermostat,additionally:[{title:$localize`Z-Wave temp sensor`,value:"Z-Wave temp sensor"},{title:$localize`DS18B20`,value:"ds18b20",type:e.Yi.DS18B20}]},{title:$localize`Cooling thermostat`,value:"coolingThermostat",type:e.Yi.Thermostat,additionally:[{title:$localize`Z-Wave temp sensor`,value:"Z-Wave temp sensor"},{title:$localize`DS18B20`,value:"ds18b20",type:e.Yi.DS18B20}]}].map(f=>({...f,withType:!0})),g=[{title:$localize`Dimmer`,value:"dimmer",type:e.Yi.SwitchMultilevel},{title:$localize`Red LED`,value:i.J$.Red,type:e.Yi.SwitchColor,group:t.F.Color},{title:$localize`Green LED`,value:i.J$.Green,type:e.Yi.SwitchColor,group:t.F.Color},{title:$localize`Blue LED`,value:i.J$.Blue,type:e.Yi.SwitchColor,group:t.F.Color},{title:$localize`White LED`,value:i.J$.White,type:e.Yi.SwitchColor,group:t.F.Color}],C=[],a=[{title:$localize`Percentages, %`,value:i.s4.Percentage,type:e.Yi.SensorMultilevel},{title:$localize`Temperature, °C`,value:i.s4.Temperature,type:e.Yi.SensorMultilevel},{title:$localize`Luminance, lux`,value:i.s4.Luminance,type:e.Yi.SensorMultilevel},{title:$localize`Humidity, %`,value:i.s4.Humidity,type:e.Yi.SensorMultilevel},{title:$localize`Voltage, V`,value:i.s4.Voltage,type:e.Yi.SensorMultilevel},{title:$localize`Current, A`,value:i.s4.Current,type:e.Yi.SensorMultilevel},{title:$localize`Distance, m`,value:i.s4.Distance,type:e.Yi.SensorMultilevel},{title:$localize`Pressure, kPa`,value:i.s4.Pressure,type:e.Yi.SensorMultilevel},{title:$localize`CO2, ppm`,value:i.s4.Ppm,type:e.Yi.SensorMultilevel}],h=f=>[9600,14400,19200,38400,57600,115200,230400].map(v=>({title:$localize`${v} kbps`,value:v,type:f})),O=[{key:"Analog input 0-3 V",title:$localize`Analog input 0-3 V`,options:a,offset:i.jk.V3},{key:"Analog input 0-5 V",title:$localize`Analog input 0-5 V`,options:a,offset:i.jk.V5},{key:"Analog input 0-12 V",title:$localize`Analog input 0-12 V`,options:a,offset:i.jk.V12},{key:"Digital input 0/3 V",title:$localize`Digital input 0/3 V`,withGround:3,options:d},{key:"Digital input 0/5 V",title:$localize`Digital input 0/5 V`,withGround:5,options:d},{key:"Digital input 0/12 V",title:$localize`Digital input 0/12 V`,withGround:12,options:d},{key:"Digital output 0/3 V",title:$localize`Digital output 0/3 V`,options:_}],P=[{key:"Temperature",title:$localize`Temperature`,options:Array.from({length:10}).map((f,v)=>({title:$localize`${v+1} sensor`,value:v+1,type:e.Yi.DS18B20}))}],M=[{key:"temperature-humidity",title:$localize`Temperature/humidity`,options:[{title:$localize`DHT11`,value:"dht11",type:e.Yi.DHT},{title:$localize`DHT22`,value:"dht22",type:e.Yi.DHT}]}]},8084:(y,m,r)=>{r.d(m,{l:()=>R});var u=r(8645),e=r(9773),i=r(6729),t=r(5879),d=r(4630),_=r(6814),g=r(1175),C=r(2296),a=r(6223),h=r(151),O=r(5683),P=r(8525),M=r(3680);const f=["optionsList",""];function v(o,c){if(1&o&&(t.TgZ(0,"mat-option",6),t._uU(1),t.qZA()),2&o){const s=c.$implicit;t.Q6J("value",s),t.xp6(1),t.Oqu(s.title)}}function $(o,c){if(1&o&&(t.TgZ(0,"mat-form-field",1)(1,"mat-select",7)(2,"mat-option",6),t.SDv(3,8),t.qZA(),t.TgZ(4,"mat-option",6),t.SDv(5,9),t.qZA()()()),2&o){const s=t.oxw();t.xp6(2),t.Q6J("value",s.connectionMode.Normal),t.xp6(2),t.Q6J("value",s.connectionMode.Inverted)}}function T(o,c){if(1&o&&(t.TgZ(0,"mat-option",6),t._uU(1),t.qZA()),2&o){const s=c.$implicit;t.Q6J("value",s.value),t.xp6(1),t.Oqu(s.title)}}function S(o,c){if(1&o&&(t.TgZ(0,"mat-form-field",1)(1,"mat-select",10),t.YNc(2,T,2,2,"mat-option",3),t.qZA()()),2&o){const s=c.ngIf;t.xp6(2),t.Q6J("ngForOf",s)}}function x(o,c){if(1&o&&(t.TgZ(0,"div",11),t._uU(1),t.TgZ(2,"mat-icon"),t._uU(3,"arrow_right_alt"),t.qZA(),t._UZ(4,"input",12),t._uU(5," - "),t._UZ(6,"input",13),t.qZA()),2&o){const s=t.oxw();t.xp6(1),t.hij(" ",s.optionsList.key," ")}}let I=(()=>{var o;class c{constructor(n){this.formBuilder=n,this.changePin=new t.vpe,this.connectionMode=h.jD,this.destroy$=new u.x,this.deviceForm=this.formBuilder.nonNullable.group({list:new a.NI(null),type:new a.NI(null),additionally:new a.NI(null),lowerBound:new a.NI(null),upperBound:new a.NI(null)})}ngOnChanges(n){n.init&&n.init.currentValue?.id&&this.deviceForm.controls.list.patchValue(this.optionsList.options.find(l=>l.value===n.init.currentValue.id)??null,{emitEvent:!1})}ngOnInit(){this.InitForm(),this.deviceForm.valueChanges.pipe((0,e.R)(this.destroy$)).subscribe(n=>{const{list:l,...p}=n;this.changePin.emit({...p,title:l?.title,id:l?.value,deviceType:l?.type,group:l?.group})}),this.init||this.deviceForm.updateValueAndValidity()}ngOnDestroy(){this.destroy$.next(),this.destroy$.complete()}InitForm(){this.deviceForm.controls.list.valueChanges.pipe((0,e.R)(this.destroy$)).subscribe(l=>{this.updateForm(l)});const n=this.optionsList.options.find(({value:l})=>l===this.init?.id);this.deviceForm.controls.list.patchValue(n??this.optionsList.options[0])}updateForm(n){n?.withType?this.deviceForm.controls.type.patchValue(this.init?.type??h.jD.Normal,{emitEvent:!1}):this.deviceForm.controls.type.reset(void 0,{emitEvent:!1}),n?.additionally?this.deviceForm.controls.additionally.patchValue(this.init?.additionally??n.additionally[0].value,{emitEvent:!1}):this.deviceForm.controls.additionally.reset(void 0,{emitEvent:!1}),this.optionsList.offset&&(this.deviceForm.controls.lowerBound.patchValue(this.init?.lowerBound??0,{emitEvent:!1}),this.deviceForm.controls.upperBound.patchValue(this.init?.upperBound??99,{emitEvent:!1}))}}return(o=c).\u0275fac=function(n){return new(n||o)(t.Y36(a.qu))},o.\u0275cmp=t.Xpm({type:o,selectors:[["configurator-child-pin-configurator","optionsList",""]],inputs:{optionsList:"optionsList",init:"init"},outputs:{changePin:"changePin"},features:[t.TTD],attrs:f,decls:7,vars:5,consts:function(){let s,n;return s=$localize`Normal`,n=$localize`Inverted`,[[1,"child-pin",3,"formGroup"],["appearance","fill",1,"select"],["formControlName","list","panelClass","select__item",1,"select__display"],[3,"value",4,"ngFor","ngForOf"],["appearance","fill","class","select",4,"ngIf"],["class","inputs",4,"ngIf"],[3,"value"],["formControlName","type","panelClass","select__item",1,"select__display"],s,n,["formControlName","additionally","panelClass","select__item",1,"select__display"],[1,"inputs"],["formControlName","lowerBound","maxlength","2","type","number",1,"short",2,"text-align","right"],["type","number","formControlName","upperBound","maxlength","2",1,"short"]]},template:function(n,l){1&n&&(t.TgZ(0,"form",0)(1,"mat-form-field",1)(2,"mat-select",2),t.YNc(3,v,2,2,"mat-option",3),t.qZA()(),t.YNc(4,$,6,2,"mat-form-field",4),t.YNc(5,S,3,1,"mat-form-field",4),t.YNc(6,x,7,1,"div",5),t.qZA()),2&n&&(t.Q6J("formGroup",l.deviceForm),t.xp6(3),t.Q6J("ngForOf",l.optionsList.options),t.xp6(1),t.Q6J("ngIf",null==l.deviceForm.controls.list.value?null:l.deviceForm.controls.list.value.withType),t.xp6(1),t.Q6J("ngIf",null==l.deviceForm.controls.list.value?null:l.deviceForm.controls.list.value.additionally),t.xp6(1),t.Q6J("ngIf",l.optionsList.offset))},dependencies:[_.sg,_.O5,g.Hw,O.KE,a._Y,a.Fj,a.wV,a.JJ,a.JL,a.nD,a.sg,a.u,P.gD,M.ey],styles:["[_nghost-%COMP%]   .child-pin[_ngcontent-%COMP%]{display:flex;flex-direction:column}[_nghost-%COMP%]     .mat-mdc-form-field-infix{padding-bottom:5px!important;padding-top:5px!important;min-height:0!important}[_nghost-%COMP%]     .mat-mdc-form-field-subscript-wrapper{height:8px}[_nghost-%COMP%]   .short[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;border:none;width:2ch;font-size:16px;-moz-appearance:textfield;outline:none}[_nghost-%COMP%]   .short[_ngcontent-%COMP%]::-webkit-inner-spin-button, [_nghost-%COMP%]   .short[_ngcontent-%COMP%]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}[_nghost-%COMP%]   .inputs[_ngcontent-%COMP%]{display:flex;align-items:center}"],changeDetection:0}),c})();const w=["pinList",""];function A(o,c){if(1&o){const s=t.EpF();t.TgZ(0,"mat-icon",8),t.NdJ("click",function(){t.CHM(s);const l=t.oxw();return t.KtG(l.remove())}),t._uU(1,"chevron_left"),t.qZA()}2&o&&t.Udp("cursor","pointer")}function E(o,c){if(1&o&&(t.TgZ(0,"div",9),t._uU(1),t.qZA()),2&o){const s=t.oxw();t.xp6(1),t.hij(" ",s.selected.title," ")}}function z(o,c){if(1&o){const s=t.EpF();t.TgZ(0,"button",12),t.NdJ("click",function(){const p=t.CHM(s).$implicit,D=t.oxw(2);return t.KtG(D.selected=p)}),t.TgZ(1,"div",13)(2,"div",14),t._uU(3),t.qZA(),t.TgZ(4,"div",15)(5,"mat-icon",16),t._uU(6,"chevron_right"),t.qZA(),t.TgZ(7,"mat-icon",17),t._uU(8,"chevron_right"),t.qZA()()()()}if(2&o){const s=c.$implicit;t.xp6(3),t.hij(" ",s.title," ")}}function N(o,c){if(1&o&&(t.TgZ(0,"div",10),t.YNc(1,z,9,1,"button",11),t.qZA()),2&o){const s=t.oxw();t.xp6(1),t.Q6J("ngForOf",s.options.pin)}}function F(o,c){if(1&o){const s=t.EpF();t.TgZ(0,"div",18)(1,"configurator-child-pin-configurator",19),t.NdJ("changePin",function(l){t.CHM(s);const p=t.oxw();return t.KtG(p.changePin(l))}),t.qZA()()}if(2&o){const s=t.oxw();t.xp6(1),t.Q6J("optionsList",s.selected)("init",s.init)}}let R=(()=>{var o;class c{set options(n){const l=n.pin.map(p=>{if(p.withGround){const D=p.options.map(Y=>({...Y,additionally:[{title:`${p.withGround} `+$localize`V or ground`,value:p.withGround??-1},{title:$localize`Free or ground`,value:i.ny.Free}]}));return{...p,options:D}}return p});this._options={...n,pin:l},this.setDevice(this.pinsStateService.snapshot)}get options(){return this._options}constructor(n,l){this.pinsStateService=n,this.changeDetectorRef=l,this.destroyed$=new u.x,this.shadow=!0}ngOnInit(){this.pinsStateService.state$.pipe((0,e.R)(this.destroyed$)).subscribe(n=>{this.setDevice(n)})}ngOnDestroy(){this.destroyed$.next(),this.destroyed$.complete()}changePin(n){this.pinsStateService.patch({id:this.options.id,key:this.selected?.key,device:n,offset:this.selected?.offset,group:this.selected?.group},this.pinList)}remove(){this.pinsStateService.patch({id:this.options.id,device:{...this.pinsStateService.snapshot.find(({id:n})=>n===this.options.id)?.device??{},remove:!0},group:this.selected?.group},this.pinList),this.selected=void 0}setDevice(n){const l=n.find(({id:p})=>p===this.options.id);this.selected=this.options.pin.find(({key:p})=>l?.key===p),this.init=l?.device,this.changeDetectorRef.detectChanges()}}return(o=c).\u0275fac=function(n){return new(n||o)(t.Y36(d.z),t.Y36(t.sBO))},o.\u0275cmp=t.Xpm({type:o,selectors:[["configurator-pin-configurator","pinList",""]],hostVars:2,hostBindings:function(n,l){2&n&&t.ekj("mat-elevation-z8",l.shadow)},inputs:{pinList:"pinList",options:"options"},attrs:w,decls:9,vars:5,consts:[[1,"title__wrapper"],[1,"title__main"],[3,"cursor","click",4,"ngIf"],[1,"title"],["class","subtitle",4,"ngIf"],[1,"wrapper"],["class","pins",4,"ngIf"],["class","options",4,"ngIf"],[3,"click"],[1,"subtitle"],[1,"pins"],["mat-button","",3,"click",4,"ngFor","ngForOf"],["mat-button","",3,"click"],[1,"button"],[1,"button__title"],[1,"arrow"],[1,"live-arrow"],[1,"live-arrow","hide-arrow"],[1,"options"],[3,"optionsList","init","changePin"]],template:function(n,l){1&n&&(t.TgZ(0,"div",0)(1,"div",1),t.YNc(2,A,2,2,"mat-icon",2),t.TgZ(3,"span",3),t._uU(4),t.qZA()(),t.YNc(5,E,2,1,"div",4),t.qZA(),t.TgZ(6,"div",5),t.YNc(7,N,2,1,"div",6),t.YNc(8,F,2,2,"div",7),t.qZA()),2&n&&(t.xp6(2),t.Q6J("ngIf",l.selected),t.xp6(2),t.hij(" ",l.options.title," "),t.xp6(1),t.Q6J("ngIf",l.selected),t.xp6(2),t.Q6J("ngIf",!l.selected),t.xp6(1),t.Q6J("ngIf",l.selected))},dependencies:[_.sg,_.O5,g.Hw,C.lW,I],styles:["[_nghost-%COMP%]{display:flex;flex-direction:column;align-items:center;padding:8px;border-radius:4px}[_nghost-%COMP%]   .title__wrapper[_ngcontent-%COMP%]{display:flex;align-items:center;padding-bottom:8px;flex-direction:column;width:100%}[_nghost-%COMP%]   .title__wrapper[_ngcontent-%COMP%]   .title__main[_ngcontent-%COMP%]{display:flex;width:100%}[_nghost-%COMP%]   .title__wrapper[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%]{font-weight:700;flex-grow:1;display:flex;justify-content:center;align-items:center}[_nghost-%COMP%]   .pins[_ngcontent-%COMP%]{display:flex;flex-direction:column}[_nghost-%COMP%]   .pins[_ngcontent-%COMP%]   .button[_ngcontent-%COMP%]{display:flex;align-items:center}[_nghost-%COMP%]   .pins[_ngcontent-%COMP%]   .button[_ngcontent-%COMP%]:hover   .live-arrow[_ngcontent-%COMP%]{opacity:1;animation:1s _ngcontent-%COMP%_arrow infinite ease-in-out}[_nghost-%COMP%]   .pins[_ngcontent-%COMP%]   .button[_ngcontent-%COMP%]:hover   .live-arrow.hide-arrow[_ngcontent-%COMP%]{animation:1s .5s _ngcontent-%COMP%_arrow infinite ease-in-out;opacity:1}[_nghost-%COMP%]   .pins[_ngcontent-%COMP%]   .button__title[_ngcontent-%COMP%]{flex-grow:1;text-align:left}[_nghost-%COMP%]   .pins[_ngcontent-%COMP%]   .button[_ngcontent-%COMP%]   .arrow[_ngcontent-%COMP%]{position:relative}[_nghost-%COMP%]   .pins[_ngcontent-%COMP%]   .button[_ngcontent-%COMP%]   .arrow[_ngcontent-%COMP%]   .live-arrow[_ngcontent-%COMP%]{transform:translate(10px)}[_nghost-%COMP%]   .pins[_ngcontent-%COMP%]   .button[_ngcontent-%COMP%]   .arrow[_ngcontent-%COMP%]   .live-arrow.hide-arrow[_ngcontent-%COMP%]{position:absolute;right:0;opacity:0}@keyframes _ngcontent-%COMP%_arrow{0%{transform:translate(10px)}15%{opacity:0;transform:translate(12px)}15.1%{transform:translate(0);opacity:0}65%{opacity:1}to{transform:translate(10px)}}[_nghost-%COMP%]     .mdc-button__label{width:100%}"],changeDetection:0}),c})()},7065:(y,m,r)=>{r.d(m,{V:()=>i});var u=r(7328),e=r(5879);let i=(()=>{var t;class d{constructor(){this.store$=new u.t(1)}select(g){this.store$.next(g)}get selectObserver(){return this.store$.asObservable()}}return(t=d).\u0275fac=function(g){return new(g||t)},t.\u0275prov=e.Yz7({token:t,factory:t.\u0275fac,providedIn:"root"}),d})()}}]);