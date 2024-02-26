
import { QRCode, QRCodeOption, QRErrorCorrectLevel } from "./qrcode";

export {ZUnoCompilerClass, ZUnoCompilerLoadSketchOutProt};

type ZUnoCompilerLoadSketchOutFunProt = (out:ZUnoCompilerLoadSketchOutProt) => void;

type ZUnoCompilerLoadSketchOutProt = {
	"dsk"?:string,
	"smart_qr"?:string,
}

type ZUnoCompilerProgressCbkProt = (severity:string, message:string) => void;

type ZUnoCompilerSketchErrorProt = (str:Error) => void;

type ZUnoCompilerLoadSketchResultProt = {
	"status":number,
	"log":string,
	"message":string,
	"bin":string,
};


type ZUnoCompilerVersionHwResultProt = {
	[index:string]:{"seq":number},
};

type ZUnoCompilerVersionResultProt = {
	"status":number,
	"log":string,
	"message":string,
	"version":{"hw": ZUnoCompilerVersionHwResultProt}
};

type SerialPortOpenOptionProt = {
	"baudRate":number,
	"bufferSize":number,
};

type SerialPortProt = {
	readonly readable:ReadableStream,
	readonly writable:WritableStream,
	close(): Promise<void>,
	open(options?: SerialPortOpenOptionProt): Promise<void>,
};

type ZUnoCompilerParametr = {
	"freq":number,
	"sec":number,
	"main_pow":number,
};

type ZUnoCompilerSelf = {
	"port":SerialPortProt,
	"queue":Array<number>,
	"seqNo":number,
	"baudRate":number,
	"paramtr"?:ZUnoCompilerParametr,
	"md"?: BoardInfoProt
};

type BoardInfoZwDataProt = {
	"s2_keys":number,
	"device_type":number,
	"device_icon":number,
	"vendor":number,
	"product_type":number,
	"product_id":number,
	"version":number,
	"LR":boolean,
};

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
};

interface FreqTableProt {
	name: string;
	id: number;
}

class ZUnoCompilerClass {
	private readonly SOF_CODE:number							= 0x01;
	private readonly NACK_CODE:number							= 0x15;
	private readonly CAN_CODE:number							= 0x18;
	private readonly ACK_CODE:number							= 0x06;
	private readonly REQUEST_CODE:number						= 0x00;

	private readonly RECV_OK:number								= 0x00;
	private readonly RECV_NOACK:number							= 0x01;
	private readonly RECV_INVALIDDATALEN:number					= 0x02;
	private readonly RECV_INVALIDCRC:number						= 0x03;
	private readonly RECV_NOSOF:number							= 0x05;

	private readonly dtr_timeout:number							= 250;
	private readonly rcv_sof_timeout:number						= 3500;

	private readonly ADDITIONAL_SIZE:number						= 3;

	private readonly ZUNO_HEADER_PREAMBL:string					= "ZMEZUNOC";

	private readonly SK_START_OFFSET_OLD:number					= 0x30000;
	private readonly SK_HEADER_SIZE:number						= 0xC0;
	private readonly SK_HEADER_VERSION_MSB_OFFSET:number		= 0x08;
	private readonly SK_HEADER_VERSION_LSB_OFFSET:number		= 0x09;
	private readonly SK_HEADER_NAME_START:number				= 56;
	private readonly SK_HEADER_MAX_NAME:number					= 47;
	private readonly SK_HEADER_HWREW_OFFSET:number				= this.SK_HEADER_NAME_START + this.SK_HEADER_MAX_NAME + 1;

	private static readonly FREQ_TABLE_U7: FreqTableProt[]				= [
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

	private readonly ZUNO_LIC_FLAGS_NAMES_MAX_POWER:number		= 4;

	private readonly MAX_DEFAULT_RF_POWER:number				= 50

	private readonly COM_PORT_FILTERS							= [{ usbVendorId: 0x10c4, usbProductId: 0xea60 }];
	private readonly ZUNO_BAUD									= [230400, 230400*2, 230400*4, 115200];

	private readonly CRC_POLY:number							= 0x1021;

	private progressCbk:ZUnoCompilerProgressCbkProt|null;
	private promise_wait: Promise<ZUnoCompilerLoadSketchOutProt|void>;
	private variable_self:ZUnoCompilerSelf|undefined = undefined;
	private xhr_compile:XMLHttpRequest|undefined = undefined;
	private xhr_version:XMLHttpRequest|undefined = undefined;
	private xhr_bootloader:XMLHttpRequest|undefined = undefined;

	constructor(code:string, freq:string|null, sec:boolean, main_pow:number, cbk:ZUnoCompilerProgressCbkProt|null = null) {
		this.progressCbk = cbk;
		this.promise_wait = this.sketch(this, code, freq, sec, main_pow);
	}

	private progress(variable_this:ZUnoCompilerClass, severity:string, message:string): void {
		if (variable_this.progressCbk != null) {
			variable_this.progressCbk(severity, message);
		}
	}

	private calcSigmaCRC16(variable_this:ZUnoCompilerClass, crc:number, data:Array<number>, offset:number, llen:number):number {
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
					crc ^= variable_this.CRC_POLY;
				}
				bit_mask >>= 1;
			}
		}
		return (crc);
	}

	private Checksum(data:Array<number>):number {
		let ret = 0xff;
		let i = 0x0;

		while (i < data.length) {
			ret = ret ^ data[i];
			i++;
		}
		return (ret);
	}

	private sleep(ms:number):Promise<void> {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	private async write(variable_this:ZUnoCompilerClass, variable_self:ZUnoCompilerSelf, data:Array<number>): Promise<void> {
		const data_uint8:Uint8Array = new Uint8Array(data);
		const writer = variable_self["port"].writable.getWriter();
		await writer.write(data_uint8);
		writer.releaseLock();
	}

	private async sendNack(variable_this:ZUnoCompilerClass, variable_self:ZUnoCompilerSelf): Promise<void> {
		await variable_this.write(variable_this, variable_self, [variable_this.NACK_CODE])
	}

	async sendAck(variable_this:ZUnoCompilerClass, variable_self:ZUnoCompilerSelf): Promise<void> {
		await variable_this.write(variable_this, variable_self, [variable_this.ACK_CODE])
	}

	private async readWithTimeout(variable_this:ZUnoCompilerClass, variable_self:ZUnoCompilerSelf, timeout:number): Promise<Uint8Array> {
		let out:Uint8Array;
		const reader = variable_self["port"].readable.getReader();
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

	private async read(variable_this:ZUnoCompilerClass, variable_self:ZUnoCompilerSelf, num:number): Promise<Array<number>> {
		let out:Array<number>, i:number, rep:number, tempos:number|undefined;

		rep = 0x0;
		while (rep < 10) {
			if (variable_self["queue"].length >= num) {
				out = [];
				i = 0x0;
				while (i < num) {
					tempos = variable_self["queue"].shift();
					if (tempos == undefined)
						break ;
					out.push(tempos);
					i++;
				}
				return (out);
			}
			const value:Uint8Array = await variable_this.readWithTimeout(variable_this, variable_self, 100);
			i = 0x0;
			while (i < value.byteLength) {
				variable_self["queue"].push(value[i])
				i++;
			}
			rep++;
		}
		if (num >= variable_self["queue"].length)
			num = variable_self["queue"].length;
		out = [];
		i = 0x0;
		while (i < num) {
			tempos = variable_self["queue"].shift();
			if (tempos == undefined)
				break ;
			out.push(tempos);
			i++;
		}
		return (out);
	}

	private async clear(variable_this:ZUnoCompilerClass, variable_self:ZUnoCompilerSelf):  Promise<void> {
		while (true) {
			const value = await variable_this.readWithTimeout(variable_this, variable_self, 100);
			if (value.length == 0x0)
				return ;
		}
	}

	private async waitSOF(variable_this:ZUnoCompilerClass, variable_self:ZUnoCompilerSelf): Promise<boolean> {
		const sof_timeout:number = Date.now() + variable_this.rcv_sof_timeout;

		while (sof_timeout > Date.now()) {
			const sof:Array<number> = await variable_this.read(variable_this, variable_self, 0x1);
				if (sof.length == 0x0) {
				await variable_this.sleep(100);
				continue ;
			}
			if (sof[0x0] == variable_this.SOF_CODE)
				return (true);
			await variable_this.sleep(200);
		}
		return (false);
	}

	private async recvIncomingRequest(variable_this:ZUnoCompilerClass, variable_self:ZUnoCompilerSelf): Promise<Array<number>> {
		let buff_data:Array<number>;

		if (await variable_this.waitSOF(variable_this, variable_self) == false)
			return ([variable_this.RECV_NOSOF]);
		buff_data = await variable_this.read(variable_this, variable_self, 0x1);
		if (buff_data.length == 0x0)
			return ([variable_this.RECV_NOSOF]);
		const len_data:number = buff_data[0x0];
		buff_data = await variable_this.read(variable_this, variable_self, len_data);
			if (buff_data.length != len_data) {
			await variable_this.sendNack(variable_this, variable_self);
			return ([variable_this.RECV_INVALIDDATALEN]);
		}
		const check_buff:Array<number> = [len_data].concat(buff_data.slice(0, len_data - 0x1))
		const check_sum:number = variable_this.Checksum(check_buff);
		if (check_sum != buff_data[len_data - 1]) {
			await variable_this.sendNack(variable_this, variable_self);
			return ([variable_this.RECV_INVALIDCRC]);
		}
		await variable_this.sendAck(variable_this, variable_self);
		return ([variable_this.RECV_OK].concat(check_buff));
	}

	private async resyncZunoPort(variable_this:ZUnoCompilerClass, variable_self:ZUnoCompilerSelf): Promise<boolean> {
		const data:Array<number> = await variable_this.recvIncomingRequest(variable_this, variable_self);
		if (data[0x0] != variable_this.RECV_OK)
			return (false);
		return (true);
	}

	private async sendData(variable_this:ZUnoCompilerClass, variable_self:ZUnoCompilerSelf, cmd:number, databuff:Array<number>, have_callback:boolean = false): Promise<void> {
		let final_data:Array<number>, data_len:number;

		data_len = databuff.length + variable_this.ADDITIONAL_SIZE;
		if (have_callback == true)
			data_len++;
		if (data_len > 255) {
			const crc_data:Array<number> = [0x00, variable_this.REQUEST_CODE, cmd].concat(databuff);
			final_data = [0x00, (data_len >> 8)& 0x0FF, data_len & 0x0FF, variable_this.REQUEST_CODE, cmd].concat(databuff);
			if (have_callback == true)
				final_data = final_data.concat([variable_self["seqNo"]]);
			const crc16:number = variable_this.calcSigmaCRC16(variable_this, 0x1D0F, crc_data, 0, crc_data.length);
			final_data = [variable_this.SOF_CODE].concat(final_data).concat([(crc16 >> 8) & 0xFF, (crc16) & 0xFF]);
			await variable_this.write(variable_this, variable_self, final_data);
			variable_self["seqNo"] += 1;
			variable_self["seqNo"] &= 0XFF;// 1 byte
			return ;
		}
		final_data = [data_len & 0x0FF, variable_this.REQUEST_CODE, cmd].concat(databuff);
		if (have_callback == true)
			final_data = final_data.concat([variable_self["seqNo"]]);
		const crc:number = variable_this.Checksum(final_data);
		final_data = [variable_this.SOF_CODE].concat(final_data).concat([crc]);
		await variable_this.write(variable_this, variable_self, final_data);
		variable_self["seqNo"] += 1;
		variable_self["seqNo"] &= 0XFF;// 1 byte
	}

	private async sendCommandUnSz(variable_this:ZUnoCompilerClass, variable_self:ZUnoCompilerSelf, cmd:number, databuff:Array<number>, have_callback:boolean = false, retries:number = 0x3): Promise<Array<number>> {
		let rbuff:Array<number>;

		await variable_this.clear(variable_this, variable_self);
		while (true) {
			await variable_this.sendData(variable_this, variable_self, cmd, databuff, have_callback);
			rbuff = await variable_this.read(variable_this, variable_self, 0x1)
			if (rbuff.length == 0x0)
				return ([variable_this.RECV_NOACK]);
			if (rbuff[0] == variable_this.ACK_CODE)
				break ;
			if (rbuff[0] == variable_this.CAN_CODE) {
				// console.warn("!!!CANCODE");
				await variable_this.recvIncomingRequest(variable_this, variable_self);
				retries -= 1;
				if (retries > 0)
					continue ;
			}
			if (rbuff[0] == variable_this.NACK_CODE) {
				// console.debug("!!!NACK");
				retries -= 1;
				if (retries > 0)
					continue ;
			}
			return ([variable_this.RECV_NOACK]);
		}
		const result:Array<number> = await variable_this.recvIncomingRequest(variable_this, variable_self);
		return (result);
	}

	private async readNVM(variable_this:ZUnoCompilerClass, variable_self:ZUnoCompilerSelf, addr:number, size:number): Promise<Array<number>> {
		return (await variable_this.sendCommandUnSz(variable_this, variable_self, 0x2A, [(addr >> 16) & 0xFF, (addr >> 8) & 0xFF, addr & 0xFF, (size >> 8) & 0xFF, size & 0xFF], false));
	}

	private async writeNVM(variable_this:ZUnoCompilerClass, variable_self:ZUnoCompilerSelf, addr:number, buff:Array<number>): Promise<Array<number>> {
		const size = buff.length;
		const data_addr = [(addr >> 16) & 0xFF, (addr >> 8) & 0xFF, addr & 0xFF, (size >> 8) & 0xFF, size & 0xFF];
		return (await variable_this.sendCommandUnSz(variable_this, variable_self, 0x2B, data_addr.concat(buff), false));
	}

	private async checkBootImage(variable_this:ZUnoCompilerClass, variable_self:ZUnoCompilerSelf): Promise<Array<number>> {
		return (variable_this.sendCommandUnSz(variable_this, variable_self, 0x08, [0x04], false));
	}

	private async softReset(variable_this:ZUnoCompilerClass, variable_self:ZUnoCompilerSelf): Promise<Array<number>> {
		return (variable_this.sendCommandUnSz(variable_this, variable_self, 0x08, [], false));
	}

	private async pushSketch(variable_this:ZUnoCompilerClass, variable_self:ZUnoCompilerSelf, addr:number, size:number, crc16:number): Promise<Array<number>> {
		return variable_this.sendCommandUnSz(variable_this, variable_self, 0x08, [0x01, (addr >> 16) & 0xFF, (addr >> 8) & 0xFF, addr & 0xFF, (size >> 8) & 0xFF, size & 0xFF, (crc16 >> 8) & 0xFF, (crc16) & 0xFF], false);
	}

	private freq_int_to_str(val:number): string|null {
		let i = 0x0;
		while (i < ZUnoCompilerClass.FREQ_TABLE_U7.length) {
			if (ZUnoCompilerClass.FREQ_TABLE_U7[i].id == val)
				return (ZUnoCompilerClass.FREQ_TABLE_U7[i].name);
			i++;
		}
		return (null);
	}

	private freq_str_to_int(val:string|null): number|null {
		let i = 0x0;

		if (val == null)
			return (null);
		while (i < ZUnoCompilerClass.FREQ_TABLE_U7.length) {
			if (ZUnoCompilerClass.FREQ_TABLE_U7[i].name == val)
				return (ZUnoCompilerClass.FREQ_TABLE_U7[i].id);
			i++;
		}
		return (null);
	}

	private zme_costruct_int(arr:Array<number>, n:number, inv:boolean = true): number {
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

	private readBoardInfoCheckFlag(lic_flags:Array<number>, flag_bit:number): boolean {
		const byte:number = ((flag_bit - (flag_bit % 0x8)) / 0x8)
		if (lic_flags.length < byte)
			return (false);
		const flag:number = lic_flags[byte];
		if ((flag & (0x1 << (flag_bit % 0x8))) == 0x0)
			return (false);
		return (true);
	}

	private conv2Decimal(variable_this:ZUnoCompilerClass, buff:Array<number>, separator:string = "-"): string {
		let i:number, text:string, v:number;

		text = "";
		i = 0x0;
		while (i < (buff.length / 2)) {
			v = buff[ (i * 2)];
			v <<= 8;
			v += buff[ (i * 2) + 1];
			if(i != 0)
				text += separator;
			text += variable_this._compile_zwave_qrcode_padding(v, 5);
			i = i + 1;
		}
		return (text)
	}

	private _compile_zwave_qrcode_padding(num:number, max:number): string {
		let num_str = num.toString(0xA);

		while (num_str.length < max)
			num_str = '0' + num_str;
		return (num_str);
	}

	private async compile_zwave_qrcode(variable_this:ZUnoCompilerClass, product_data:BoardInfoZwDataProt, dsk:Array<number>, version:number): Promise<string> {
		let protocol_map:number, text:string;

		text = variable_this._compile_zwave_qrcode_padding(product_data["s2_keys"], 3);
		text = text + variable_this.conv2Decimal(variable_this, dsk,"");
		// #ProductType
		text = text + "0010" + variable_this._compile_zwave_qrcode_padding(product_data["device_type"], 5) + variable_this._compile_zwave_qrcode_padding(product_data["device_icon"], 5);
		// #ProductID
		text = text + "0220" + variable_this._compile_zwave_qrcode_padding(product_data["vendor"], 5) + variable_this._compile_zwave_qrcode_padding(product_data["product_type"], 5) +
		variable_this._compile_zwave_qrcode_padding(product_data["product_id"], 5) + variable_this._compile_zwave_qrcode_padding(version, 5);
		// # Supported Protocols
		protocol_map = 0x01;
		if (product_data["LR"] == true)
			protocol_map = protocol_map | 0x02;
		text += "0803" + variable_this._compile_zwave_qrcode_padding(protocol_map, 3);
		// # MaxInclusionInterval
		text = text + "0403005";// # ==5*128=640
		const buf:ArrayBuffer = Uint8Array.from(unescape(encodeURIComponent(text)), c=>c.charCodeAt(0)).buffer;
		const digest:Uint8Array = new Uint8Array(await crypto.subtle.digest('SHA-1', buf));
		text = "9001" + variable_this._compile_zwave_qrcode_padding((digest[0x0] << 0x8) | digest[0x1], 5) + text;
		return (text);
	}

	private toString(array:Array<number>): string {
		let result:string;
	
		result = "";
		for (let i = 0; i < array.length; i++) {
			result += String.fromCharCode(array[i]);
		}
		return result;
	}

	private async readBoardInfo(variable_this:ZUnoCompilerClass, variable_self:ZUnoCompilerSelf): Promise<BoardInfoProt> {
		let bLR:boolean, param_info:Array<number>, code_sz_shift:number, shift_smrt:number, lic_flags:Array<number>;

		const md:BoardInfoProt = {
		};
		const info:Array<number> = await variable_this.readNVM(variable_this, variable_self, 0xFFFF00, 0x01);
		if (info.length < 10)
			return (md);
		param_info = await variable_this.readNVM(variable_this, variable_self, 0xFFE000, 0x09);
		if (param_info.length < 10)
			return (md);
		bLR = false;
		param_info = param_info.slice(4, param_info.length);
		const r:string|null = variable_this.freq_int_to_str(param_info[1])
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
			md["code_size"] = variable_this.zme_costruct_int(bts.slice(12,12+3), 3, false);
		} else
			md["code_size"] =  (bts[12] << 8) | (bts[13]);
		md["ram_size"] =  (bts[14+code_sz_shift] << 8) | (bts[15+code_sz_shift]);
		md["chip_uid"] =  bts.slice(16+code_sz_shift,16+code_sz_shift+8);
		md["s2_pub"] =  bts.slice(24+code_sz_shift,24+code_sz_shift+16);
		md["dsk"] = variable_this.conv2Decimal(variable_this, md["s2_pub"],"-");
		md["dbg_lock"] =  0xFF;
		md["home_id"] = 0;
		md["node_id"] = 0;
		md["custom_code_offset"] = variable_this.SK_START_OFFSET_OLD;
		if (bts.length > (44+code_sz_shift)) {
			md["dbg_lock"] = bts[40+code_sz_shift];
			md["home_id"] = variable_this.zme_costruct_int(bts.slice(41+code_sz_shift,41+code_sz_shift+4), 4, false);
			md["node_id"] = bts[45+code_sz_shift];
		}
		shift_smrt = 11;
		if (bts.length > (46+code_sz_shift)) {
			if (md["build_number"] < 1669) {
				shift_smrt = 90;
				md["smart_qr"] = variable_this.toString(bts.slice(46+code_sz_shift,46+code_sz_shift+90));
			}
			else {
				md["zwdata"] = {
					"s2_keys": bts[46+code_sz_shift],
					"device_type": variable_this.zme_costruct_int(bts.slice(47+code_sz_shift, 47+code_sz_shift+2), 2, false),
					"device_icon": variable_this.zme_costruct_int(bts.slice(49+code_sz_shift, 49+code_sz_shift+2), 2, false),
					"vendor": variable_this.zme_costruct_int(bts.slice(51+code_sz_shift, 51+code_sz_shift+2), 2, false),
					"product_type": variable_this.zme_costruct_int(bts.slice(53+code_sz_shift, 53+code_sz_shift+2), 2, false),
					"product_id": variable_this.zme_costruct_int(bts.slice(55+code_sz_shift, 55+code_sz_shift+2), 2, false),
					"version":	md["version"],
					"LR": bLR,
				};
				md["smart_qr"] = await variable_this.compile_zwave_qrcode(variable_this, md["zwdata"], md["s2_pub"], md["version"]);
			}
		}
		md["boot_offset"] = 0x3a000;
		if (bts.length > (46+shift_smrt+code_sz_shift+4)) {
			md["custom_code_offset"] = variable_this.zme_costruct_int(bts.slice(46+code_sz_shift+shift_smrt,46+code_sz_shift+shift_smrt+4), 4, false)
			if(md["custom_code_offset"] > 0x36000)
				md["boot_offset"] = 0x40000;
		}
		md["max_default_power"] = variable_this.MAX_DEFAULT_RF_POWER;
		lic_flags = [0];
		if (bts.length > (46+shift_smrt+code_sz_shift+8)) {
			const prod_shift:number = 46+code_sz_shift+shift_smrt+4;
			const lic_shift:number = prod_shift+8+4+4;
			lic_flags = bts.slice(lic_shift+2,lic_shift+2+8);
			if (bts.length > (lic_shift + 10) && md["build_number"] >= 2849)
				md["max_default_power"] = bts[lic_shift+10]
		}
		if (variable_this.readBoardInfoCheckFlag(lic_flags, variable_this.ZUNO_LIC_FLAGS_NAMES_MAX_POWER) == false)
			md["flag_max_power"] = false;
		else
			md["flag_max_power"] = true;
		md["param_info"] = param_info;
		return (md);
	}

	private async freezeSketch(variable_this:ZUnoCompilerClass, variable_self:ZUnoCompilerSelf): Promise<boolean> {
		let sleep_time:number, rcv:Array<number>, retries:number;

		retries = 0x3;
		sleep_time = 10;
		if (navigator.platform == "Win32")
			sleep_time = 50;
		while (retries != 0x0) {
			rcv = await variable_this.sendCommandUnSz(variable_this, variable_self, 0x08, [0x02], false);
			if (rcv.length > 4) {
			if ((rcv[0] == variable_this.RECV_OK) && (rcv[3] == 0x08) && (rcv[4] == 0x00))
				return (true);
			}
			await variable_this.sleep(sleep_time);
			retries -= 1;
		}
		return (false);
	}

	private async syncWithDevice(variable_this:ZUnoCompilerClass, variable_self:ZUnoCompilerSelf): Promise<boolean> {
		if (await variable_this.resyncZunoPort(variable_this, variable_self) == false) {
			return (false);
		}
		if (await variable_this.freezeSketch(variable_this, variable_self) == false) {
			return (false);
		}
		return (true);
	}

	private HeaderCmp(variable_this:ZUnoCompilerClass, header:Array<number>, core_version:number, hw_rev:number, build_number:number): boolean {
		const data_uint8 = new Uint8Array(header.slice(0, variable_this.ZUNO_HEADER_PREAMBL.length));
		const string = new TextDecoder().decode(data_uint8);
		if (variable_this.ZUNO_HEADER_PREAMBL != string)
			return (false);
		const header_version:number = (header[variable_this.SK_HEADER_VERSION_MSB_OFFSET] << 8) | header[variable_this.SK_HEADER_VERSION_LSB_OFFSET];
		if (header_version != core_version)
			return (false);
		if(hw_rev != -1 && build_number >= 2849) {
			const header_hw_rev:number = variable_this.zme_costruct_int(header.slice(variable_this.SK_HEADER_HWREW_OFFSET, variable_this.SK_HEADER_HWREW_OFFSET + 0x2), 2);
			if(hw_rev != header_hw_rev)
				return (false);
		}
		return (true);
	}

	private async writeArrayToNVM(variable_this:ZUnoCompilerClass, variable_self:ZUnoCompilerSelf, md:BoardInfoProt, nvmaddr:number, array:Array<number>, data_offset:number = 0x0): Promise<Array<number>|null> {
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
			res = await variable_this.writeNVM(variable_this, variable_self, nvmaddr, buff);
			if (res[0] != variable_this.RECV_OK || res[4] != 1)
				return (null);
			offset += len_send;
			data_remains -= len_send;
			nvmaddr += len_send;
		}
		return (ret_data);
	}

	private async applyPrams(variable_this:ZUnoCompilerClass, variable_self:ZUnoCompilerSelf, md:BoardInfoProt): Promise<boolean> {
		const bts:Array<number>|undefined = md["param_info"];
		if (bts == undefined || variable_self["paramtr"] == undefined)
			return (false);
		while (bts.length < 8)
			bts.push(0x0);
		bts[1] = variable_self["paramtr"]["freq"];
		if (bts.length > 8)
			bts[8] = variable_self["paramtr"]["freq"];
		bts[4] = variable_self["paramtr"]["sec"];
		bts[2] = variable_self["paramtr"]["main_pow"];
		const res:Array<number> = await variable_this.writeNVM(variable_this, variable_self, 0xFFE000, bts);
		if (res[0] != variable_this.RECV_OK || res[4] != 1) {
			return (false);
		}
		return (true);
	}

	private async waitFinware(variable_this:ZUnoCompilerClass, variable_self:ZUnoCompilerSelf): Promise<boolean> {
		const sof_timeout:number = Date.now() + 30000;
		while (sof_timeout > Date.now()) {
			const result:Array<number> = await variable_this.recvIncomingRequest(variable_this, variable_self);
			if (result[0] == variable_this.RECV_OK) {
				if (result.length < 6)
					return (false);
				if (result[3] != 0x08)
					return (false);
				if (result[5] != 0x01)
					return (false);
				return (true);
			}
			await variable_this.sleep(100);
		}
		return (false);
	}

	private _base64ToArrayBuffer(base64:string): Array<number> {
		const binaryString:string = atob(base64);
		const bytes:Array<number> = new Array(binaryString.length);
		for (let i = 0; i < binaryString.length; i++) {
			bytes[i] = binaryString.charCodeAt(i);
		}
		return bytes;
	}

	private _xhr_compile(xhr:XMLHttpRequest, data:string, hw_str:string): Promise<ZUnoCompilerLoadSketchResultProt> {
		return new Promise(function(resolve, reject) {
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

	private _xhr_version(xhr:XMLHttpRequest): Promise<ZUnoCompilerVersionResultProt> {
		return new Promise(function(resolve, reject) {

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

	private _xhr_bootloader(xhr:XMLHttpRequest, hw_str:string, build_number:string): Promise<ZUnoCompilerLoadSketchResultProt> {
		return new Promise(function(resolve, reject) {
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

	private sketch_info(variable_this:ZUnoCompilerClass, message:string): void {
		variable_this.progress(variable_this, "info", message);
	}
	
	private async sketch_error(variable_this:ZUnoCompilerClass, variable_self:ZUnoCompilerSelf|null, reject:ZUnoCompilerSketchErrorProt, result:Error): Promise<void> {
		if (variable_self != null)
			await variable_self["port"].close();
		variable_this.progress(variable_this, "error", result.message);
		reject(result);
	}

	private load_sketch(variable_this:ZUnoCompilerClass, variable_self:ZUnoCompilerSelf, promise_compile: Promise<ZUnoCompilerLoadSketchResultProt>, resolve:ZUnoCompilerLoadSketchOutFunProt, reject:ZUnoCompilerSketchErrorProt): void {
		variable_this.sketch_info(variable_this, "Compiling the sketch...");
		promise_compile.then(async function (result:ZUnoCompilerLoadSketchResultProt) {
			let bin:Array<number>;
			try {
				if (result["status"] != 0x0)
					return (variable_this.sketch_error(variable_this, variable_self, reject, Error("Compilation returned incorrect status: " + result["status"] + " log: " + result["log"] + " message: " +  result["message"])));
				bin = variable_this._base64ToArrayBuffer(result["bin"]);
			} catch (error) {
				return (variable_this.sketch_error(variable_this, variable_self, reject, Error("The structure obtained after compilation is not valid")));
			}
			variable_this.sketch_info(variable_this, "Compiling the sketch done");
			const md:BoardInfoProt|undefined = variable_self["md"];
			if (md == undefined || md["version"] == undefined ||  md["hw_rev"] == undefined || md["build_number"] == undefined || md["custom_code_offset"] == undefined || md["code_size"] == undefined)
				return (variable_this.sketch_error(variable_this, variable_self, reject, Error("Something unexpected happened and the variable turned out to be empty - contact support.")));
			const header:Array<number> = bin.slice(0, variable_this.SK_HEADER_SIZE);
			if (variable_this.HeaderCmp(variable_this, header, md["version"], md["hw_rev"], md["build_number"]) == false)
				return (variable_this.sketch_error(variable_this, variable_self, reject, Error("The sketch and firmware version do not match")));
			if (bin.length > md["code_size"])
				return (variable_this.sketch_error(variable_this, variable_self, reject, Error("Sketch size too large")));
				variable_this.sketch_info(variable_this, "Uploading the sketch...");
			if (await variable_this.applyPrams(variable_this, variable_self, md) == false)
				return (variable_this.sketch_error(variable_this, variable_self, reject, Error("Failed to apply settings")));
			const sk_data:Array<number>|null = await variable_this.writeArrayToNVM(variable_this, variable_self, md, md["custom_code_offset"], bin);
			if (sk_data == null)
				return (variable_this.sketch_error(variable_this, variable_self, reject, Error("Failed to upload sketch")));
			const crc16:number = variable_this.calcSigmaCRC16(variable_this, 0x1D0F, sk_data, 0, sk_data.length);
			const res:Array<number> = await variable_this.pushSketch(variable_this, variable_self, md["custom_code_offset"], sk_data.length, crc16);
			if (res[0] != variable_this.RECV_OK)
				return (variable_this.sketch_error(variable_this, variable_self, reject, Error("Failed to apply sketch")));
			if(res[4] == 0xFE)
				return (variable_this.sketch_error(variable_this, variable_self, reject, Error("Can't upload sketch! Something went wrong. Bad CRC16 :'( .")));
			await variable_self["port"].close();
			variable_this.sketch_info(variable_this, "Uploading the sketch done");
			variable_this.sketch_info(variable_this, "QR code read...");
			await variable_this.sleep(variable_this.dtr_timeout);// The time for the capacitor on the DTR line to recharge
			try {
				await variable_self["port"].open({ baudRate: variable_self["baudRate"], bufferSize: 8192 });
			} catch(e) {
				return (variable_this.sketch_error(variable_this, null, reject, Error("Check yours, maybe another application is using it")));
			}
			if (await variable_this.syncWithDevice(variable_this, variable_self) == false)
				return (variable_this.sketch_error(variable_this, null, reject, Error("After a successful firmware update, it was not possible to re-sync with Z-Uno")));
			variable_self["md"] = await variable_this.readBoardInfo(variable_this, variable_self);
			if (Object.keys(variable_self["md"]).length == 0x0)
				return (variable_this.sketch_error(variable_this, variable_self, reject, Error("Failed to read board info")));
			await variable_this.softReset(variable_this, variable_self);
			await variable_self["port"].close();
			const out:ZUnoCompilerLoadSketchOutProt = {};
			out["dsk"] = variable_self["md"]["dsk"];
			if ("smart_qr" in variable_self["md"]) {
				out["smart_qr"] = variable_self["md"]["smart_qr"];
				variable_this.sketch_info(variable_this, "QR code read done");
				resolve(out);
				return ;
			}
			return (variable_this.sketch_error(variable_this, variable_self, reject, Error("Failed to read QR code")));
		}, async function (err:Error) {
			return (variable_this.sketch_error(variable_this, variable_self, reject, err));
		});
	}

	private load_bootloader(variable_this:ZUnoCompilerClass, variable_self:ZUnoCompilerSelf, promise_compile: Promise<ZUnoCompilerLoadSketchResultProt>, resolve:ZUnoCompilerLoadSketchOutFunProt, reject:ZUnoCompilerSketchErrorProt, hw_str:string, build_number_str:string): void {
		variable_this.sketch_info(variable_this, "Uploading a new bootloader to the Z-Uno...");
		const xhr_bootloader = new XMLHttpRequest();
		const promise_bootloader:Promise<ZUnoCompilerLoadSketchResultProt> = variable_this._xhr_bootloader(xhr_bootloader, hw_str, build_number_str);
		variable_this.xhr_bootloader = xhr_bootloader;
		promise_bootloader.then(async function(result:ZUnoCompilerLoadSketchResultProt) {
			let bin:Array<number>;
			try {
				if (result["status"] != 0x0)
					return (variable_this.sketch_error(variable_this, variable_self, reject, Error("Get bootloader returned incorrect status: " + result["status"] + " log: " + result["log"] + " message: " +  result["message"])));
				bin = variable_this._base64ToArrayBuffer(result["bin"]);
			} catch (error) {
				return (variable_this.sketch_error(variable_this, variable_self, reject, Error("The bootloader structure obtained after version is not valid")));
			}
			if (variable_self["md"] == undefined || variable_self["md"]["boot_offset"] == undefined)
				return (variable_this.sketch_error(variable_this, variable_self, reject, Error("Something unexpected happened and the variable turned out to be empty - contact support.")));
			const sk_data:Array<number>|null = await variable_this.writeArrayToNVM(variable_this, variable_self, variable_self["md"], variable_self["md"]["boot_offset"], bin);
			if (sk_data == null)
				return (variable_this.sketch_error(variable_this, variable_self, reject, Error("Failed to upload firmware")));
			await variable_this.checkBootImage(variable_this, variable_self);
			if (await variable_this.waitFinware(variable_this, variable_self) == false)
				return (variable_this.sketch_error(variable_this, variable_self, reject, Error("Something is wrong - the firmware could not be updated - there may be a problem with the version")));
			await variable_this.waitFinware(variable_this, variable_self);
			await variable_self["port"].close();
			await variable_this.sleep(variable_this.dtr_timeout);// The time for the capacitor on the DTR line to recharge
			try {
				await variable_self["port"].open({ baudRate: variable_self["baudRate"], bufferSize: 8192 });
			} catch(e) {
				return (variable_this.sketch_error(variable_this, null, reject, Error("Check yours, maybe another application is using it")));
			}
			if (await variable_this.syncWithDevice(variable_this, variable_self) == false)
				return (variable_this.sketch_error(variable_this, null, reject, Error("After a successful firmware update, it was not possible to re-sync with Z-Uno")));
			variable_self["md"] = await variable_this.readBoardInfo(variable_this, variable_self);
			if (Object.keys(variable_self["md"]).length == 0x0)
				return (variable_this.sketch_error(variable_this, variable_self, reject, Error("Failed to read board info")));
			if (Number(build_number_str) != variable_self["md"]["build_number"])
				return (variable_this.sketch_error(variable_this, variable_self, reject, Error("Although the firmware was successfully updated, the actual version was no longer needed")));
			variable_this.sketch_info(variable_this, "Uploading a new bootloader to the Z-Uno done");
			return (variable_this.load_sketch(variable_this, variable_self, promise_compile, resolve, reject));
		}, async function(err) {
			return (variable_this.sketch_error(variable_this, variable_self, reject, err));
		});
	}

	private async sketch(variable_this:ZUnoCompilerClass, text_sketch:string, freq_str:string|null, sec:boolean, main_pow:number): Promise<ZUnoCompilerLoadSketchOutProt|void> {
		return new Promise(async function(resolve:ZUnoCompilerLoadSketchOutFunProt, reject:ZUnoCompilerSketchErrorProt) {
			let i:number, hw_str:string, sec_prm:number, port:SerialPortProt;
			const filters = variable_this.COM_PORT_FILTERS;
			if (!(navigator as any).serial || !(navigator as any).serial.requestPort) {
				return (variable_this.sketch_error(variable_this, null, reject, Error("Sorry, this feature is supported only on Chrome, Edge and Opera")));
			}
			try {
				port = await (navigator as any).serial.requestPort({filters});
			} catch(e) {
				return (variable_this.sketch_error(variable_this, null, reject, Error("No port selected")));
			}
			try {
				await port.close();//If the port was already opened by us, but for some reason we left without closing it
			} catch(e) {
			}
			variable_this.sketch_info(variable_this, "Determining the revision Z-Uno ...");
			const variable_self:ZUnoCompilerSelf = {"queue":[], "seqNo": 0x0, "port": port, "baudRate": 230400};
			variable_this.variable_self = variable_self;
			i = 0x0;
			while (i < variable_this.ZUNO_BAUD.length) {
				try {
					await variable_self["port"].open({ baudRate: variable_this.ZUNO_BAUD[i], bufferSize: 8192 });
				} catch(e) {
					return (variable_this.sketch_error(variable_this, null, reject, Error("Check yours, maybe another application is using it")));
				}
				if (await variable_this.syncWithDevice(variable_this, variable_self) == true)
					break ;
				await variable_self["port"].close();
				await variable_this.sleep(variable_this.dtr_timeout);// The time for the capacitor on the DTR line to recharge
				i++;
			}
			if (i >= variable_this.ZUNO_BAUD.length)
				return (variable_this.sketch_error(variable_this, null, reject, Error("Failed to sync with Z-Uno")));
			variable_self["baudRate"] = variable_this.ZUNO_BAUD[i];
			variable_self["md"] = await variable_this.readBoardInfo(variable_this, variable_self);
			if (Object.keys(variable_self["md"]).length == 0x0)
				return (variable_this.sketch_error(variable_this, variable_self, reject, Error("Failed to read board info")));
			variable_this.sketch_info(variable_this, "Determining the revision Z-Uno done");
			if (variable_self["md"]["freq_str"] == undefined)
				return (variable_this.sketch_error(variable_this, variable_self, reject, Error("Something unexpected happened and the variable turned out to be empty - contact support.")));
			if (freq_str == null)
				freq_str = variable_self["md"]["freq_str"]
			const freq:number|null = variable_this.freq_str_to_int(freq_str);
			if (sec === true)
				sec_prm = 0x1;
			else if (sec === false)
				sec_prm = 0x0;
			else
				return (variable_this.sketch_error(variable_this, null, reject, Error("The security parameter is incorrectly specified")));
			if (variable_self["md"]["max_default_power"] == undefined)
				return (variable_this.sketch_error(variable_this, variable_self, reject, Error("Something unexpected happened and the variable turned out to be empty - contact support.")));
			if (main_pow < 0x1 || main_pow > 0xFF)
				return (variable_this.sketch_error(variable_this, null, reject, Error("Radio power is out of range")));
			if (freq == null)
				return (variable_this.sketch_error(variable_this, null, reject, Error("The specified radio frequency is not supported")));
			if (variable_self["md"]["flag_max_power"] == false) {
				if (main_pow > variable_self["md"]["max_default_power"])
					return (variable_this.sketch_error(variable_this, variable_self, reject, Error("Your license does not support this maximum radio power value.")));
			}
			variable_self["paramtr"] = {
				"main_pow":main_pow,
				"freq": freq,
				"sec": sec_prm,
			};
			if (variable_self["md"]["hw_rev"] == undefined)
				return (variable_this.sketch_error(variable_this, variable_self, reject, Error("Something unexpected happened and the variable turned out to be empty - contact support.")));
			hw_str = variable_self["md"]["hw_rev"].toString(0x10);
			while (hw_str.length < 0x4)
				hw_str = '0' + hw_str;
			variable_this.sketch_info(variable_this, "Checking Z-Uno version...");
			const xhr_version = new XMLHttpRequest();
			const promise_version: Promise<ZUnoCompilerVersionResultProt> = variable_this._xhr_version(xhr_version);
			variable_this.xhr_version = xhr_version;
			const xhr_compile = new XMLHttpRequest();
			variable_this.xhr_compile = xhr_compile;
			const promise_compile: Promise<ZUnoCompilerLoadSketchResultProt> = variable_this._xhr_compile(xhr_compile, text_sketch, hw_str);
			promise_version.then(async function(result:ZUnoCompilerVersionResultProt) {
				let version_list:ZUnoCompilerVersionHwResultProt;
				try {
					if (result["status"] != 0x0)
						return (variable_this.sketch_error(variable_this, variable_self, reject, Error("Get version returned incorrect status: " + result["status"] + " message: " +  result["message"])));
					version_list = result["version"]["hw"];
				} catch (error) {
					return (variable_this.sketch_error(variable_this, variable_self, reject, Error("The version structure obtained after version is not valid")));
				}
				const build_number:number = version_list[hw_str].seq;
				if (build_number === undefined)
					return (variable_this.sketch_error(variable_this, variable_self, reject, Error("The server does not support the specified board revision")));
				if (variable_self["md"] == undefined || variable_self["md"]["build_number"] == undefined)
					return (variable_this.sketch_error(variable_this, variable_self, reject, Error("Something unexpected happened and the variable turned out to be empty - contact support.")));
				if (variable_self["md"]["build_number"] > build_number)
					return (variable_this.sketch_error(variable_this, variable_self, reject, Error("The firmware on the board is newer than on the server")));
				variable_this.sketch_info(variable_this, "Checking Z-Uno version done");
				if (variable_self["md"]["build_number"] != build_number)
					return (variable_this.load_bootloader(variable_this, variable_self, promise_compile, resolve, reject, hw_str, String(build_number)));
				return (variable_this.load_sketch(variable_this, variable_self, promise_compile, resolve, reject));
			}, async function(err:Error) {
				return (variable_this.sketch_error(variable_this, variable_self, reject, err));
			});
		});
	}

	private generateQrCode(variable_this:ZUnoCompilerClass, id:HTMLElement|string, text:string): boolean {
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
			variable_this.progress(variable_this, "error", "Failed to create \"object QRCode\", check parameters.");
			return (false);
		}
		return (true);
	}

	public getWait(): Promise<ZUnoCompilerLoadSketchOutProt|void> {
		return this.promise_wait;
	}

	public cancel(): void {
		try {
			if (this.variable_self != undefined)
				this.variable_self.port.close();
		} catch (err) {
		}
		try {
			if (this.xhr_version != undefined)
				this.xhr_version.abort();
		} catch (err) {
		}
		try {
			if (this.xhr_bootloader != undefined)
				this.xhr_bootloader.abort();
		} catch (err) {
		}
		try {
			if (this.xhr_compile != undefined)
				this.xhr_compile.abort();
		} catch (err) {
		}
	}

	/**
	 * Draw the QR code of the board
	 *
	 * @param {*} id Id of the div tag that will host the QR-code image
	 * @param {*} qrContent Content of the QR-code to be printed
	 */
	public drawQR(id:HTMLElement|string, text:string): boolean {
		return this.generateQrCode(this,id, text);
	}

	/**
	 * 
	 * @returns List freq
	 */
	public static getFreqList(): Array<string> {
		let i:number;

		i = 0x0;
		const out:Array<string> = [];
		while (i < ZUnoCompilerClass.FREQ_TABLE_U7.length) {
			out.push(ZUnoCompilerClass.FREQ_TABLE_U7[i].name);
			i++;
		}
		return (out);
	}
}