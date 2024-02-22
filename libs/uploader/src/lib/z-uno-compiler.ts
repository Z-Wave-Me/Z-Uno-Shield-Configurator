
import { QRCode, QRCodeOption, QRErrorCorrectLevel } from "./qrcode";

export {ZUnoCompiler};

type ZUnoCompilerLoadSketchOutFunProt = (out:ZUnoCompilerLoadSketchOutProt) => void;

type ZUnoCompilerLoadSketchOutProt = {
	"dsk"?:string,
	"smart_qr"?:string,
}

type ZUnoCompilerProt = () => {
	setProgress: (cbk:ZUnoCompilerProgressCbkProt) => void,
	compile: (code:string, freq:string|null, sec:boolean, main_pow:number) => Promise<ZUnoCompilerLoadSketchOutProt>,
	drawQR: (id:HTMLElement|string, text:string) => QRCode|null,
	getFreqList: () =>  Array<string>,
};

type ZUnoCompilerProgressCbkProt = (severity:string, message:string) => void;

const ZUnoCompiler:ZUnoCompilerProt = () => {
	type ZUnoCompilerSketchErrorProt = (str:Error) => void;

	type ZUnoCompilerLoadSketchResultProt = {
		"status":number,
		"log":string,
		"message":string,
		"bin":string,
	}


	type ZUnoCompilerVersionHwResultProt = {
		[index:string]:{"seq":number},
	}

	type ZUnoCompilerVersionResultProt = {
		"status":number,
		"log":string,
		"message":string,
		"version":{"hw": ZUnoCompilerVersionHwResultProt}
	}

	type SerialPortOpenOptionProt = {
		"baudRate":number,
		"bufferSize":number,
	}

	type SerialProt = {
		requestPort(): Promise<SerialPortProt>,
	}

	type SerialPortProt = {
		readonly readable:ReadableStream,
		readonly writable:WritableStream,
		close(): Promise<void>,
		open(options?: SerialPortOpenOptionProt): Promise<void>,
	}

	type ZUnoCompilerParametr = {
		"freq":number,
		"sec":number,
		"main_pow":number,
	}

	type ZUnoCompilerSelf = {
		"port":SerialPortProt,
		"queue":Array<number>,
		"seqNo":number,
		"baudRate":number,
		"paramtr"?:ZUnoCompilerParametr,
		"md"?: BoardInfoProt
	}

	type BoardInfoZwDataProt = {
		"s2_keys":number,
		"device_type":number,
		"device_icon":number,
		"vendor":number,
		"product_type":number,
		"product_id":number,
		"version":number,
		"LR":boolean,
	}
	
	type BoardInfoProt = {
		"freq_i"?:number,
		"version"?:number,
		"build_number"?:number,
		"build_ts"?:number,
		"hw_rev"?:number,
		"code_size"?:number,
		"ram_size"?:number,
		"dbg_lock"?:number,
		"home_id"?:number,
		"node_id"?:number,
		"max_default_power"?:number,
		"custom_code_offset"?:number,
		"boot_offset"?:number,
		"freq_str"?:string,
		"dsk"?:string,
		"smart_qr"?:string,
		"s2_pub"?:Array<number>,
		"param_info"?:Array<number>,
		"chip_uid"?:Array<number>,
		"flag_max_power"?:boolean,
		"zwdata"?:BoardInfoZwDataProt,
	}

	interface FreqTableProt {
		name: string;
		id: number;
	}

	const SOF_CODE									= 0x01;
	const NACK_CODE									= 0x15;
	const CAN_CODE									= 0x18;
	const ACK_CODE									= 0x06;
	const REQUEST_CODE								= 0x00;

	const RECV_OK									= 0x00;
	const RECV_NOACK								= 0x01;
	const RECV_INVALIDDATALEN						= 0x02;
	const RECV_INVALIDCRC							= 0x03;
	const RECV_NOSOF								= 0x05;

	const dtr_timeout								= 250;
	const rcv_sof_timeout							= 3500;

	const ADDITIONAL_SIZE							= 3;

	const ZUNO_HEADER_PREAMBL						= "ZMEZUNOC";

	const SK_START_OFFSET_OLD						= 0x30000;
	const SK_HEADER_SIZE							= 0xC0;
	const SK_HEADER_VERSION_MSB_OFFSET				= 0x08;
	const SK_HEADER_VERSION_LSB_OFFSET				= 0x09;
	const SK_HEADER_NAME_START						= 56;
	const SK_HEADER_MAX_NAME						= 47;
	const SK_HEADER_HWREW_OFFSET					= SK_HEADER_NAME_START + SK_HEADER_MAX_NAME + 1;

	const FREQ_TABLE_U7: FreqTableProt[] = [
		{ name: "EU",id: 0x00},
		{ name: "US",id: 0x01},
		{ name: "ANZ",id: 0x02},
		{ name: "HK",id: 0x03},
		// { name: "MY",id: 0x04},
		{ name: "IN",id: 0x05},
		{ name: "IL",id: 0x06},
		{ name: "RU",id: 0x07},
		{ name: "CN",id: 0x08},
		{ name: "US_LR",id: 0x09},
		// { name: "US_LR_BK",id: 0x0A},
		{ name: "JP",id: 0x20},
		{ name: "KR",id: 0x21},
		// { name: "FK",id: 0xFE},
	];

	const ZUNO_LIC_FLAGS_NAMES_MAX_POWER			= 4;

	const MAX_DEFAULT_RF_POWER						= 50

	const COM_PORT_FILTERS = [{ usbVendorId: 0x10c4, usbProductId: 0xea60 }];
	const ZUNO_BAUD = [230400, 230400*2, 230400*4, 115200];

	const CRC_POLY									= 0x1021;

	let progressCbk:ZUnoCompilerProgressCbkProt|null = null;
	function progress(severity:string, message:string): void {
		if (progressCbk) {
			progressCbk(severity, message);
		}
	}

	function calcSigmaCRC16(crc:number, data:Array<number>, offset:number, llen:number):number {
		let new_bit:number, wrk_data:number, b:number, a:number, bit_mask:number;
		const bin_data:Array<number> = data;

		while (llen != 0) {
			llen -= 1;
			if (offset >= bin_data.length)
				wrk_data = 0xFF;
			else
				wrk_data = bin_data[offset];
			offset += 1;
			bit_mask = 0x80;
			while (bit_mask != 0) {
				a = 0;
				b = 0;
				if ((wrk_data & bit_mask) != 0)
					a = 1;
				if ((crc & 0x8000) != 0)
					b = 1;
				new_bit = a ^ b;
				crc <<= 1;
				crc = crc & 0xffff;
				if (new_bit == 1) {
					crc ^= CRC_POLY;
				}
				bit_mask >>= 1;
			}
		}
		return (crc);
	}

	function Checksum(data:Array<number>):number {
		let ret = 0xff;
		let i = 0x0;

		while (i < data.length) {
			ret = ret ^ data[i];
			i++;
		}
		return (ret);
	}

	function sleep(ms:number):Promise<void> {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	async function write(self:ZUnoCompilerSelf, data:Array<number>): Promise<void> {
		const data_uint8:Uint8Array = new Uint8Array(data);
		const writer = self["port"].writable.getWriter();
		await writer.write(data_uint8);
		writer.releaseLock();
	}

	async function sendNack(self:ZUnoCompilerSelf): Promise<void> {
		await write(self, [NACK_CODE])
	}

	async function sendAck(self:ZUnoCompilerSelf): Promise<void> {
		await write(self, [ACK_CODE])
	}

	async function readWithTimeout(self:ZUnoCompilerSelf, timeout:number): Promise<Uint8Array> {
		let out:Uint8Array;
		const reader = self["port"].readable.getReader();
		const timer = setTimeout(() => {
			reader.releaseLock();
		}, timeout);
		try {
			out = (await reader.read()).value;
		} catch (err) {
			out = new Uint8Array([]);
		}
		// console.debug("<<", out);
		clearTimeout(timer);
		reader.releaseLock();
		return (out);
	}

	async function read(self:ZUnoCompilerSelf, num:number): Promise<Array<number>> {
		let out:Array<number>, i:number, rep:number, tempos:number|undefined;

		rep = 0x0;
		while (rep < 10) {
			if (self["queue"].length >= num) {
				out = [];
				i = 0x0;
				while (i < num) {
					tempos = self["queue"].shift();
					if (tempos == undefined)
						break ;
					out.push(tempos);
					i++;
				}
				return (out);
			}
			const value:Uint8Array = await readWithTimeout(self, 100);
			i = 0x0;
			while (i < value.byteLength) {
				self["queue"].push(value[i])
				i++;
			}
			rep++;
		}
		if (num >= self["queue"].length)
			num = self["queue"].length;
		out = [];
		i = 0x0;
		while (i < num) {
			tempos = self["queue"].shift();
			if (tempos == undefined)
				break ;
			out.push(tempos);
			i++;
		}
		return (out);
	}

	async function clear(self:ZUnoCompilerSelf):  Promise<void> {
		while (true) {
			const value = await readWithTimeout(self, 100);
			if (value.length == 0x0)
				return ;
		}
	}

	async function waitSOF(self:ZUnoCompilerSelf): Promise<boolean> {
		const sof_timeout:number = Date.now() + rcv_sof_timeout;

		while (sof_timeout > Date.now()) {
			const sof:Array<number> = await read(self, 0x1);
				if (sof.length == 0x0) {
				await sleep(100);
				continue ;
			}
			if (sof[0x0] == SOF_CODE)
				return (true);
			await sleep(200);
		}
		return (false);
	}

	async function recvIncomingRequest(self:ZUnoCompilerSelf): Promise<Array<number>> {
		let buff_data:Array<number>;

		if (await waitSOF(self) == false)
			return ([RECV_NOSOF]);
		buff_data = await read(self, 0x1);
		if (buff_data.length == 0x0)
			return ([RECV_NOSOF]);
		const len_data:number = buff_data[0x0];
		buff_data = await read(self, len_data);
			if (buff_data.length != len_data) {
			await sendNack(self);
			return ([RECV_INVALIDDATALEN]);
		}
		const check_buff:Array<number> = [len_data].concat(buff_data.slice(0, len_data - 0x1))
		const check_sum:number = Checksum(check_buff);
		if (check_sum != buff_data[len_data - 1]) {
			await sendNack(self);
			return ([RECV_INVALIDCRC]);
		}
		await sendAck(self);
		return ([RECV_OK].concat(check_buff));
	}

	async function resyncZunoPort(self:ZUnoCompilerSelf): Promise<boolean> {
		const data:Array<number> = await recvIncomingRequest(self);
		if (data[0x0] != RECV_OK)
			return (false);
		return (true);
	}

	async function sendData(self:ZUnoCompilerSelf, cmd:number, databuff:Array<number>, have_callback:boolean = false): Promise<void> {
		let final_data:Array<number>, data_len:number;

		data_len = databuff.length + ADDITIONAL_SIZE;
		if (have_callback == true)
			data_len++;
		if (data_len > 255) {
			const crc_data:Array<number> = [0x00, REQUEST_CODE, cmd].concat(databuff);
			final_data = [0x00, (data_len >> 8)& 0x0FF, data_len & 0x0FF, REQUEST_CODE, cmd].concat(databuff);
			if (have_callback == true)
				final_data = final_data.concat([self["seqNo"]]);
			const crc16:number = calcSigmaCRC16(0x1D0F, crc_data, 0, crc_data.length);
			final_data = [SOF_CODE].concat(final_data).concat([(crc16 >> 8) & 0xFF, (crc16) & 0xFF]);
			await write(self, final_data);
			self["seqNo"] += 1;
			self["seqNo"] &= 0XFF;// 1 byte
			return ;
		}
		final_data = [data_len & 0x0FF, REQUEST_CODE, cmd].concat(databuff);
		if (have_callback == true)
			final_data = final_data.concat([self["seqNo"]]);
		const crc:number = Checksum(final_data);
		final_data = [SOF_CODE].concat(final_data).concat([crc]);
		await write(self, final_data);
		self["seqNo"] += 1;
		self["seqNo"] &= 0XFF;// 1 byte
	}

	async function sendCommandUnSz(self:ZUnoCompilerSelf, cmd:number, databuff:Array<number>, have_callback:boolean = false, retries:number = 0x3): Promise<Array<number>> {
		let rbuff:Array<number>;

		await clear(self);
		while (true) {
			await sendData(self, cmd, databuff, have_callback);
			rbuff = await read(self, 0x1)
			if (rbuff.length == 0x0)
				return ([RECV_NOACK]);
			if (rbuff[0] == ACK_CODE)
				break ;
			if (rbuff[0] == CAN_CODE) {
				// console.warn("!!!CANCODE");
				await recvIncomingRequest(self);
				retries -= 1;
				if (retries > 0)
					continue ;
			}
			if (rbuff[0] == NACK_CODE) {
				// console.debug("!!!NACK");
				retries -= 1;
				if (retries > 0)
					continue ;
			}
			return ([RECV_NOACK]);
		}
		const result:Array<number> = await recvIncomingRequest(self);
		return (result);
	}

	async function readNVM(self:ZUnoCompilerSelf, addr:number, size:number): Promise<Array<number>> {
		return (await sendCommandUnSz(self, 0x2A, [(addr >> 16) & 0xFF, (addr >> 8) & 0xFF, addr & 0xFF, (size >> 8) & 0xFF, size & 0xFF], false));
	}

	async function writeNVM(self:ZUnoCompilerSelf, addr:number, buff:Array<number>): Promise<Array<number>> {
		const size = buff.length;
		const data_addr = [(addr >> 16) & 0xFF, (addr >> 8) & 0xFF, addr & 0xFF, (size >> 8) & 0xFF, size & 0xFF];
		return (await sendCommandUnSz(self, 0x2B, data_addr.concat(buff), false));
	}

	async function checkBootImage(self:ZUnoCompilerSelf): Promise<Array<number>> {
		return (sendCommandUnSz(self, 0x08, [0x04], false));
	}

	async function softReset(self:ZUnoCompilerSelf): Promise<Array<number>> {
		return (sendCommandUnSz(self, 0x08, [], false));
	}

	async function pushSketch(self:ZUnoCompilerSelf, addr:number, size:number, crc16:number): Promise<Array<number>> {
		return sendCommandUnSz(self, 0x08, [0x01, (addr >> 16) & 0xFF, (addr >> 8) & 0xFF, addr & 0xFF, (size >> 8) & 0xFF, size & 0xFF, (crc16 >> 8) & 0xFF, (crc16) & 0xFF], false);
	}

	function freq_int_to_str(val:number): string|null {
		let i = 0x0;
		while (i < FREQ_TABLE_U7.length) {
			if (FREQ_TABLE_U7[i].id == val)
				return (FREQ_TABLE_U7[i].name);
			i++;
		}
		return (null);
	}

	function freq_str_to_int(val:string|null): number|null {
		let i = 0x0;

		if (val == null)
			return (null);
		while (i < FREQ_TABLE_U7.length) {
			if (FREQ_TABLE_U7[i].name == val)
				return (FREQ_TABLE_U7[i].id);
			i++;
		}
		return (null);
	}

	function zme_costruct_int(arr:Array<number>, n:number, inv:boolean = true): number {
		let val:number, i:number, indx:number;

		val = 0;
		i = 0x0;
		while (i < arr.length) {
			val <<= 8;
			indx = i;
			if (inv == true)
				indx = n-1-i
			if ((indx < arr.length) && (indx >= 0))
				val += arr[indx];
			i++;
		}
		return (val);
	}

	function readBoardInfoCheckFlag(lic_flags:Array<number>, flag_bit:number): boolean {
		const byte:number = ((flag_bit - (flag_bit % 0x8)) / 0x8)
		if (lic_flags.length < byte)
			return (false);
		const flag:number = lic_flags[byte];
		if ((flag & (0x1 << (flag_bit % 0x8))) == 0x0)
			return (false);
		return (true);
	}

	function conv2Decimal(buff:Array<number>, separator:string = "-"): string {
		let i:number, text:string, v:number;

		text = "";
		i = 0x0;
		while (i < (buff.length / 2)) {
			v = buff[ (i * 2)];
			v <<= 8;
			v += buff[ (i * 2) + 1];
			if(i != 0)
				text += separator;
			text += _compile_zwave_qrcode_padding(v, 5);
			i = i + 1;
		}
		return (text)
	}

	function _compile_zwave_qrcode_padding(num:number, max:number): string {
		let num_str = num.toString(0xA);

		while (num_str.length < max)
			num_str = '0' + num_str;
		return (num_str);
	}

	async function compile_zwave_qrcode(product_data:BoardInfoZwDataProt, dsk:Array<number>, version:number): Promise<string> {
		let protocol_map:number, text:string;

		text = _compile_zwave_qrcode_padding(product_data["s2_keys"], 3);
		text = text + conv2Decimal(dsk,"");
		// #ProductType
		text = text + "0010" + _compile_zwave_qrcode_padding(product_data["device_type"], 5) + _compile_zwave_qrcode_padding(product_data["device_icon"], 5);
		// #ProductID
		text = text + "0220" + _compile_zwave_qrcode_padding(product_data["vendor"], 5) + _compile_zwave_qrcode_padding(product_data["product_type"], 5) +
				_compile_zwave_qrcode_padding(product_data["product_id"], 5) + _compile_zwave_qrcode_padding(version, 5);
		// # Supported Protocols
		protocol_map = 0x01;
		if (product_data["LR"] == true)
			protocol_map = protocol_map | 0x02;
		text += "0803" + _compile_zwave_qrcode_padding(protocol_map, 3);
		// # MaxInclusionInterval
		text = text + "0403005";// # ==5*128=640
		const buf:ArrayBuffer = Uint8Array.from(unescape(encodeURIComponent(text)), c=>c.charCodeAt(0)).buffer;
		const digest:Uint8Array = new Uint8Array(await crypto.subtle.digest('SHA-1', buf));
		text = "9001" + _compile_zwave_qrcode_padding((digest[0x0] << 0x8) | digest[0x1], 5) + text;
		return (text);
	}

	function toString(array:Array<number>): string {
		let result:string;
	
		result = "";
		for (let i = 0; i < array.length; i++) {
			result += String.fromCharCode(array[i]);
		}
		return result;
	}

	async function readBoardInfo(self:ZUnoCompilerSelf): Promise<BoardInfoProt> {
		let bLR:boolean, param_info:Array<number>, code_sz_shift:number, shift_smrt:number, lic_flags:Array<number>;

		const md:BoardInfoProt = {
		};
		const info:Array<number> = await readNVM(self, 0xFFFF00, 0x01);
		if (info.length < 10)
			return (md);
		param_info = await readNVM(self, 0xFFE000, 0x09);
		if (param_info.length < 10)
			return (md);
		bLR = false;
		param_info = param_info.slice(4, param_info.length);
		const r:string|null = freq_int_to_str(param_info[1])
		if (r == null)
			return (md);
		if (r != null)
			if ((r == "US_LR") || (r == "US") ||  (r == "US_LR_BK"))
				bLR = true;
		md["freq_i"] = param_info[1];
		md["freq_str"] = r;
		const bts:Array<number> = info.slice(4, info.length);
		md["version"] = (bts[0] << 8) | (bts[1]);
		md["build_number"] = (bts[2] << 24) | (bts[3] << 16) |  (bts[4] << 8) | (bts[5]);
		md["build_ts"] = (bts[6] << 24) | (bts[7] << 16) |  (bts[8] << 8) | (bts[9]);
		md["hw_rev"] =  (bts[10] << 8) | (bts[11]);
		code_sz_shift = 0;
		if( md["build_number"] > 1116) {
			code_sz_shift = 1;
			md["code_size"] = zme_costruct_int(bts.slice(12,12+3), 3, false);
		} else
			md["code_size"] =  (bts[12] << 8) | (bts[13]);
		md["ram_size"] =  (bts[14+code_sz_shift] << 8) | (bts[15+code_sz_shift]);
		md["chip_uid"] =  bts.slice(16+code_sz_shift,16+code_sz_shift+8);
		md["s2_pub"] =  bts.slice(24+code_sz_shift,24+code_sz_shift+16);
		md["dsk"] = conv2Decimal(md["s2_pub"],"-");
		md["dbg_lock"] =  0xFF;
		md["home_id"] = 0;
		md["node_id"] = 0;
		md["custom_code_offset"] = SK_START_OFFSET_OLD;
		if (bts.length > (44+code_sz_shift)) {
			md["dbg_lock"] = bts[40+code_sz_shift];
			md["home_id"] = zme_costruct_int(bts.slice(41+code_sz_shift,41+code_sz_shift+4), 4, false);
			md["node_id"] = bts[45+code_sz_shift];
		}
		shift_smrt = 11;
		if (bts.length > (46+code_sz_shift)) {
			if (md["build_number"] < 1669) {
				shift_smrt = 90;
				md["smart_qr"] = toString(bts.slice(46+code_sz_shift,46+code_sz_shift+90));
			}
			else {
				md["zwdata"] = {
					"s2_keys": bts[46+code_sz_shift],
					"device_type": zme_costruct_int(bts.slice(47+code_sz_shift, 47+code_sz_shift+2), 2, false),
					"device_icon": zme_costruct_int(bts.slice(49+code_sz_shift, 49+code_sz_shift+2), 2, false),
					"vendor": zme_costruct_int(bts.slice(51+code_sz_shift, 51+code_sz_shift+2), 2, false),
					"product_type": zme_costruct_int(bts.slice(53+code_sz_shift, 53+code_sz_shift+2), 2, false),
					"product_id": zme_costruct_int(bts.slice(55+code_sz_shift, 55+code_sz_shift+2), 2, false),
					"version":	md["version"],
					"LR": bLR,
				};
				md["smart_qr"] = await compile_zwave_qrcode(md["zwdata"], md["s2_pub"], md["version"]);
			}
		}
		md["boot_offset"] = 0x3a000;
		if (bts.length > (46+shift_smrt+code_sz_shift+4)) {
			md["custom_code_offset"] = zme_costruct_int(bts.slice(46+code_sz_shift+shift_smrt,46+code_sz_shift+shift_smrt+4), 4, false)
			if(md["custom_code_offset"] > 0x36000)
				md["boot_offset"] = 0x40000;
		}
		md["max_default_power"] = MAX_DEFAULT_RF_POWER;
		lic_flags = [0];
		if (bts.length > (46+shift_smrt+code_sz_shift+8)) {
			const prod_shift:number = 46+code_sz_shift+shift_smrt+4;
			const lic_shift:number = prod_shift+8+4+4;
			lic_flags = bts.slice(lic_shift+2,lic_shift+2+8);
			if (bts.length > (lic_shift + 10) && md["build_number"] >= 2849)
				md["max_default_power"] = bts[lic_shift+10]
		}
		if (readBoardInfoCheckFlag(lic_flags, ZUNO_LIC_FLAGS_NAMES_MAX_POWER) == false)
			md["flag_max_power"] = false;
		else
			md["flag_max_power"] = true;
		md["param_info"] = param_info;
		return (md);
	}

	async function freezeSketch(self:ZUnoCompilerSelf): Promise<boolean> {
		let sleep_time:number, rcv:Array<number>, retries:number;

		retries = 0x3;
		sleep_time = 10;
		if (navigator.platform == "Win32")
			sleep_time = 50;
		while (retries != 0x0) {
			rcv = await sendCommandUnSz(self, 0x08, [0x02], false);
			if (rcv.length > 4) {
			if ((rcv[0] == RECV_OK) && (rcv[3] == 0x08) && (rcv[4] == 0x00))
				return (true);
			}
			await sleep(sleep_time);
			retries -= 1;
		}
		return (false);
	}

	async function syncWithDevice(self:ZUnoCompilerSelf): Promise<boolean> {
		if (await resyncZunoPort(self) == false) {
			return (false);
		}
		if (await freezeSketch(self) == false) {
			return (false);
		}
		return (true);
	}

	function HeaderCmp(header:Array<number>, core_version:number, hw_rev:number, build_number:number): boolean {
		const data_uint8 = new Uint8Array(header.slice(0, ZUNO_HEADER_PREAMBL.length));
		const string = new TextDecoder().decode(data_uint8);
		if (ZUNO_HEADER_PREAMBL != string)
			return (false);
		const header_version:number = (header[SK_HEADER_VERSION_MSB_OFFSET] << 8) | header[SK_HEADER_VERSION_LSB_OFFSET];
		if (header_version != core_version)
			return (false);
		if(hw_rev != -1 && build_number >= 2849) {
			const header_hw_rev:number = zme_costruct_int(header.slice(SK_HEADER_HWREW_OFFSET, SK_HEADER_HWREW_OFFSET + 0x2), 2);
			if(hw_rev != header_hw_rev)
				return (false);
		}
		return (true);
	}

	async function writeArrayToNVM(self:ZUnoCompilerSelf, md:BoardInfoProt, nvmaddr:number, array:Array<number>, data_offset:number = 0x0): Promise<Array<number>|null> {
		let data_quant:number, offset:number, data_remains:number, len_send:number, buff:Array<number>, res:Array<number>;

		const ret_data:Array<number> = array;
		offset = data_offset;
		data_remains = ret_data.length - data_offset;
		data_quant = 240;
		if (md["build_number"] != undefined && md["build_number"] >= 3396)
			data_quant = 2048;
		while (data_remains != 0x0) {
			len_send = data_quant;
			if (data_remains < data_quant)
				len_send = data_remains;
			buff = [];
			buff = buff.concat(ret_data.slice(offset,offset + len_send));
			if (buff.length == 1)
				buff = buff.concat([0xFF]);
			res = await writeNVM(self, nvmaddr, buff);
			if (res[0] != RECV_OK || res[4] != 1)
				return (null);
			offset += len_send;
			data_remains -= len_send;
			nvmaddr += len_send;
		}
		return (ret_data);
	}

	async function applyPrams(self:ZUnoCompilerSelf, md:BoardInfoProt): Promise<boolean> {
		const bts:Array<number>|undefined = md["param_info"];
		if (bts == undefined || self["paramtr"] == undefined)
			return (false);
		while (bts.length < 8)
			bts.push(0x0);
		bts[1] = self["paramtr"]["freq"];
		if (bts.length > 8)
			bts[8] = self["paramtr"]["freq"];
		bts[4] = self["paramtr"]["sec"];
		bts[2] = self["paramtr"]["main_pow"];
		const res:Array<number> = await writeNVM(self, 0xFFE000, bts);
		if (res[0] != RECV_OK || res[4] != 1) {
			return (false);
		}
		return (true);
	}

	async function waitFinware(self:ZUnoCompilerSelf): Promise<boolean> {
		const sof_timeout:number = Date.now() + 30000;
		while (sof_timeout > Date.now()) {
			const result:Array<number> = await recvIncomingRequest(self);
			if (result[0] == RECV_OK) {
				if (result.length < 6)
					return (false);
				if (result[3] != 0x08)
					return (false);
				if (result[5] != 0x01)
					return (false);
				return (true);
			}
			await sleep(100);
		}
		return (false);
	}

	function _base64ToArrayBuffer(base64:string): Array<number> {
		const binaryString:string = atob(base64);
		const bytes:Array<number> = new Array(binaryString.length);
		for (let i = 0; i < binaryString.length; i++) {
			bytes[i] = binaryString.charCodeAt(i);
		}
		return bytes;
	}

	function _xhr_compile(data:string, hw_str:string): Promise<ZUnoCompilerLoadSketchResultProt> {
		return new Promise(function(resolve, reject) {
			const xhr = new XMLHttpRequest();
			const formData = new FormData();

			formData.append("sketch", new File([new Blob([data])], "sketch", { lastModified: Date.now(), type: "text/x-arduino"}));
			formData.append("referer", document.location.href);
			const url = 'https://service.z-wave.me/z-uno-compilation-server/?compile&' + 'hw=' + hw_str;
			xhr.open("POST", url);
			xhr.responseType = 'json';
			xhr.timeout = 300000;//5 min
			xhr.ontimeout = function () {
				reject(Error("Request failed: Timed out"));
			};
			xhr.onload = function () {
				resolve(xhr.response);
			};
			xhr.onerror = function () {
				reject(Error("Request failed: Perhaps you have problems with the Internet"));
			};

			xhr.send(formData);
		});
	}

	function _xhr_version(): Promise<ZUnoCompilerVersionResultProt> {
		return new Promise(function(resolve, reject) {
			const xhr = new XMLHttpRequest();

			xhr.open("POST", 'https://service.z-wave.me/z-uno-compilation-server/?version');
			xhr.responseType = 'json';
			xhr.timeout = 30000;//30 sec
			xhr.ontimeout = function () {
				reject(Error("Request failed: Timed out"));
			};
			xhr.onload = function () {
				resolve(xhr.response);
			};
			xhr.onerror = function () {
				reject(Error("Request failed: Perhaps you have problems with the Internet"));
			};
			xhr.send();
		});
	}

	function _xhr_bootloader(hw_str:string, build_number:string): Promise<ZUnoCompilerLoadSketchResultProt> {
		return new Promise(function(resolve, reject) {
			const xhr = new XMLHttpRequest();

			const url = 'https://service.z-wave.me/z-uno-compilation-server/?bootloader&' + 'hw=' + hw_str + "&seq=" + build_number;
			xhr.open("POST", url);
			xhr.responseType = 'json';
			xhr.timeout = 30000;//30 sec
			xhr.ontimeout = function () {
				reject(Error("Request failed: Timed out"));
			};
			xhr.onload = function () {
				resolve(xhr.response);
			};
			xhr.onerror = function () {
				reject(Error("Request failed: Perhaps you have problems with the Internet"));
			};
			xhr.send();
		});
	}

	function sketch_info(message:string): void {
		progress("info", message);
	}
	
	async function sketch_error(self:ZUnoCompilerSelf|null, reject:ZUnoCompilerSketchErrorProt, result:Error): Promise<void> {
		if (self != null)
			await self["port"].close();
		progress("error", result.message);
		reject(result);
	}

	function load_sketch(self:ZUnoCompilerSelf, promise_compile: Promise<ZUnoCompilerLoadSketchResultProt>, resolve:ZUnoCompilerLoadSketchOutFunProt, reject:ZUnoCompilerSketchErrorProt): void {
		sketch_info("Compiling the sketch...");
		promise_compile.then(async function(result:ZUnoCompilerLoadSketchResultProt) {
			let bin:Array<number>;
			try {
				if (result["status"] != 0x0)
					return (sketch_error(self, reject, Error("Compilation returned incorrect status: " + result["status"] + " log: " + result["log"] + " message: " +  result["message"])));
				bin = _base64ToArrayBuffer(result["bin"]);
			} catch (error) {
				return (sketch_error(self, reject, Error("The structure obtained after compilation is not valid")));
			}
			sketch_info("Compiling the sketch done");
			const md:BoardInfoProt|undefined = self["md"];
			if (md == undefined || md["version"] == undefined ||  md["hw_rev"] == undefined || md["build_number"] == undefined || md["custom_code_offset"] == undefined || md["code_size"] == undefined)
				return (sketch_error(self, reject, Error("Something unexpected happened and the variable turned out to be empty - contact support.")));
			const header:Array<number> = bin.slice(0, SK_HEADER_SIZE);
			if (HeaderCmp(header, md["version"], md["hw_rev"], md["build_number"]) == false)
				return (sketch_error(self, reject, Error("The sketch and firmware version do not match")));
			if (bin.length > md["code_size"])
				return (sketch_error(self, reject, Error("Sketch size too large")));
			sketch_info("Uploading the sketch...");
			if (await applyPrams(self, md) == false)
				return (sketch_error(self, reject, Error("Failed to apply settings")));
			const sk_data:Array<number>|null = await writeArrayToNVM(self, md, md["custom_code_offset"], bin);
			if (sk_data == null)
				return (sketch_error(self, reject, Error("Failed to upload sketch")));
			const crc16:number = calcSigmaCRC16(0x1D0F, sk_data, 0, sk_data.length);
			const res:Array<number> = await pushSketch(self, md["custom_code_offset"], sk_data.length, crc16);
			if (res[0] != RECV_OK)
				return (sketch_error(self, reject, Error("Failed to apply sketch")));
			if(res[4] == 0xFE)
				return (sketch_error(self, reject, Error("Can't upload sketch! Something went wrong. Bad CRC16 :'( .")));
			await self["port"].close();
			sketch_info("Uploading the sketch done");
			sketch_info("QR code read...");
			await sleep(dtr_timeout);// The time for the capacitor on the DTR line to recharge
			try {
				await self["port"].open({ baudRate: self["baudRate"], bufferSize: 8192 });
			} catch(e) {
				return (sketch_error(null, reject, Error("Check yours, maybe another application is using it")));
			}
			if (await syncWithDevice(self) == false)
				return (sketch_error(null, reject, Error("After a successful firmware update, it was not possible to re-sync with Z-Uno")));
			self["md"] = await readBoardInfo(self);
			if (Object.keys(self["md"]).length == 0x0)
				return (sketch_error(self, reject, Error("Failed to read board info")));
			await softReset(self);
			await self["port"].close();
			const out:ZUnoCompilerLoadSketchOutProt = {};
			out["dsk"] = self["md"]["dsk"];
			if ("smart_qr" in self["md"]) {
				out["smart_qr"] = self["md"]["smart_qr"];
				sketch_info("QR code read done");
				resolve(out);
				return ;
			}
			return (sketch_error(self, reject, Error("Failed to read QR code")));
		}, async function(err:Error) {
			return (sketch_error(self, reject, err));
		});
	}

	function load_bootloader(self:ZUnoCompilerSelf, promise_compile: Promise<ZUnoCompilerLoadSketchResultProt>, resolve:ZUnoCompilerLoadSketchOutFunProt, reject:ZUnoCompilerSketchErrorProt, hw_str:string, build_number_str:string): void {
		sketch_info("Uploading a new bootloader to the Z-Uno...");
		const promise_bootloader:Promise<ZUnoCompilerLoadSketchResultProt> = _xhr_bootloader(hw_str, build_number_str);
		promise_bootloader.then(async function(result:ZUnoCompilerLoadSketchResultProt) {
			let bin:Array<number>;
			try {
				if (result["status"] != 0x0)
					return (sketch_error(self, reject, Error("Get bootloader returned incorrect status: " + result["status"] + " log: " + result["log"] + " message: " +  result["message"])));
				bin = _base64ToArrayBuffer(result["bin"]);
			} catch (error) {
				return (sketch_error(self, reject, Error("The bootloader structure obtained after version is not valid")));
			}
			if (self["md"] == undefined || self["md"]["boot_offset"] == undefined)
				return (sketch_error(self, reject, Error("Something unexpected happened and the variable turned out to be empty - contact support.")));
			const sk_data:Array<number>|null = await writeArrayToNVM(self, self["md"], self["md"]["boot_offset"], bin);
			if (sk_data == null)
				return (sketch_error(self, reject, Error("Failed to upload firmware")));
			await checkBootImage(self);
			if (await waitFinware(self) == false)
				return (sketch_error(self, reject, Error("Something is wrong - the firmware could not be updated - there may be a problem with the version")));
			await waitFinware(self);
			await self["port"].close();
			await sleep(dtr_timeout);// The time for the capacitor on the DTR line to recharge
			try {
				await self["port"].open({ baudRate: self["baudRate"], bufferSize: 8192 });
			} catch(e) {
				return (sketch_error(null, reject, Error("Check yours, maybe another application is using it")));
			}
			if (await syncWithDevice(self) == false)
				return (sketch_error(null, reject, Error("After a successful firmware update, it was not possible to re-sync with Z-Uno")));
			self["md"] = await readBoardInfo(self);
			if (Object.keys(self["md"]).length == 0x0)
				return (sketch_error(self, reject, Error("Failed to read board info")));
			if (Number(build_number_str) != self["md"]["build_number"])
				return (sketch_error(self, reject, Error("Although the firmware was successfully updated, the actual version was no longer needed")));
			sketch_info("Uploading a new bootloader to the Z-Uno done");
			return (load_sketch(self, promise_compile, resolve, reject));
		}, async function(err) {
			return (sketch_error(self, reject, err));
		});
	}

	async function sketch(text_sketch:string, freq_str:string|null, sec:boolean, main_pow:number): Promise<ZUnoCompilerLoadSketchOutProt> {
		return new Promise(async function(resolve:ZUnoCompilerLoadSketchOutFunProt, reject:ZUnoCompilerSketchErrorProt) {
			let i:number, hw_str:string, sec_prm:number, port:SerialPortProt;
			const filters = COM_PORT_FILTERS;
			if (!(navigator as any).serial || !(navigator as any).serial.requestPort) {
				return (sketch_error(null, reject, Error("Sorry, this feature is supported only on Chrome, Edge and Opera")));
			}
			try {
				port = await (navigator as any).serial.requestPort({filters});
			} catch(e) {
				return (sketch_error(null, reject, Error("No port selected")));
			}
			try {
				await port.close();//If the port was already opened by us, but for some reason we left without closing it
			} catch(e) {
			}
			sketch_info("Determining the revision Z-Uno ...");
			const self:ZUnoCompilerSelf = {"queue":[], "seqNo": 0x0, "port": port, "baudRate": 230400};
			i = 0x0;
			while (i < ZUNO_BAUD.length) {
				try {
					await self["port"].open({ baudRate: ZUNO_BAUD[i], bufferSize: 8192 });
				} catch(e) {
					return (sketch_error(null, reject, Error("Check yours, maybe another application is using it")));
				}
				if (await syncWithDevice(self) == true)
					break ;
				await self["port"].close();
				await sleep(dtr_timeout);// The time for the capacitor on the DTR line to recharge
				i++;
			}
			if (i >= ZUNO_BAUD.length)
				return (sketch_error(null, reject, Error("Failed to sync with Z-Uno")));
			self["baudRate"] = ZUNO_BAUD[i];
			self["md"] = await readBoardInfo(self);
			if (Object.keys(self["md"]).length == 0x0)
				return (sketch_error(self, reject, Error("Failed to read board info")));
			sketch_info("Determining the revision Z-Uno done");
			if (self["md"]["freq_str"] == undefined)
				return (sketch_error(self, reject, Error("Something unexpected happened and the variable turned out to be empty - contact support.")));
			if (freq_str == null)
				freq_str = self["md"]["freq_str"]
			const freq:number|null = freq_str_to_int(freq_str);
			if (sec === true)
				sec_prm = 0x1;
			else if (sec === false)
				sec_prm = 0x0;
			else
				return (sketch_error(null, reject, Error("The security parameter is incorrectly specified")));
			if (self["md"]["max_default_power"] == undefined)
				return (sketch_error(self, reject, Error("Something unexpected happened and the variable turned out to be empty - contact support.")));
			if (main_pow < 0x1 || main_pow > 0xFF)
				return (sketch_error(null, reject, Error("Radio power is out of range")));
			if (freq == null)
				return (sketch_error(null, reject, Error("The specified radio frequency is not supported")));
			if (self["md"]["flag_max_power"] == false) {
				if (main_pow > self["md"]["max_default_power"])
					return (sketch_error(self, reject, Error("Your license does not support this maximum radio power value.")));
			}
			self["paramtr"] = {
				"main_pow":main_pow,
				"freq": freq,
				"sec": sec_prm,
			};
			if (self["md"]["hw_rev"] == undefined)
				return (sketch_error(self, reject, Error("Something unexpected happened and the variable turned out to be empty - contact support.")));
			hw_str = self["md"]["hw_rev"].toString(0x10);
			while (hw_str.length < 0x4)
				hw_str = '0' + hw_str;
			sketch_info("Checking Z-Uno version...");
			const promise_version: Promise<ZUnoCompilerVersionResultProt> = _xhr_version();
			const promise_compile: Promise<ZUnoCompilerLoadSketchResultProt> = _xhr_compile(text_sketch, hw_str);
			promise_version.then(async function(result:ZUnoCompilerVersionResultProt) {
				let version_list:ZUnoCompilerVersionHwResultProt;
				try {
					if (result["status"] != 0x0)
						return (sketch_error(self, reject, Error("Get version returned incorrect status: " + result["status"] + " message: " +  result["message"])));
					version_list = result["version"]["hw"];
				} catch (error) {
					return (sketch_error(self, reject, Error("The version structure obtained after version is not valid")));
				}
				const build_number:number = version_list[hw_str].seq;
				if (build_number === undefined)
					return (sketch_error(self, reject, Error("The server does not support the specified board revision")));
				if (self["md"] == undefined || self["md"]["build_number"] == undefined)
					return (sketch_error(self, reject, Error("Something unexpected happened and the variable turned out to be empty - contact support.")));
				if (self["md"]["build_number"] > build_number)
					return (sketch_error(self, reject, Error("The firmware on the board is newer than on the server")));
				sketch_info("Checking Z-Uno version done");
				if (self["md"]["build_number"] != build_number)
					return (load_bootloader(self, promise_compile, resolve, reject, hw_str, String(build_number)));
				return (load_sketch(self, promise_compile, resolve, reject));
			}, async function(err:Error) {
				return (sketch_error(self, reject, err));
			});
		});
	}

	function generateQrCode(id:HTMLElement|string, text:string): QRCode|null {
		let obj_QRCode:QRCode;
		const option:QRCodeOption = {
			text: text,
			width: 256,
			height: 256,
			colorDark: "#000000",
			colorLight: "#ffffff",
			correctLevel: QRErrorCorrectLevel.L,
		};
		
		try {
			obj_QRCode = new QRCode(id, option);
		} catch(e) {
			progress("error", "Failed to create \"object QRCode\", check parameters.");
			return (null);
		}
		return (obj_QRCode);
	}

	return {
		/**
		 * Compile the sketch and load it to the Z-Uno board
		 *
		 * @param {*} code Sketch source code (string)
		 * @param {*} freq Frequncy (string, ex. 'EU') or null - current use
		 * @param {*} sec With security or not (boolean)
		 * @param {*} main_pow max power (int, without a special license the maximum is 50)
		 * @returns Returns a dictionary with smart_qr as string and dsk as string
		 */
		compile: function(code:string, freq:string|null, sec:boolean, main_pow:number):Promise<ZUnoCompilerLoadSketchOutProt> {
			return sketch(code, freq, sec, main_pow);
		},
	
		/**
		 * Draw the QR code of the board
		 *
		 * @param {*} id Id of the div tag that will host the QR-code image
		 * @param {*} qrContent Content of the QR-code to be printed
		 */
		drawQR: function(id:HTMLElement|string, text:string): QRCode|null {
			return generateQrCode(id, text);
		},
		
		/**
		 * Set progress log callback
		 *
		 */
		setProgress: function(cbk:ZUnoCompilerProgressCbkProt): void {
			progressCbk = cbk;
		},

		/**
		 * 
		 * @returns List freq
		 */
		getFreqList: function(): Array<string> {
			let i:number, out:Array<string>;

			i = 0x0;
			out = [];
			while (i < FREQ_TABLE_U7.length) {
				out.push(FREQ_TABLE_U7[i].name);
				i++;
			}
			return (out);
		}

	};
}