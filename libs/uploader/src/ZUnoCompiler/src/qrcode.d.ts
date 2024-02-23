
export const enum QRErrorCorrectLevel {
	M = 0x0,
	L = 0x1,
	H = 0x2,
	Q = 0x3,
}

export type QRCodeOption = {
	"text" : string, 
	"width" : number, 
	"height" : number,
	"colorDark" : string,
	"colorLight" : string,
	"correctLevel" : QRErrorCorrectLevel,
}

export declare class QRCode {
	constructor(id:HTMLElement|string, text:string|QRCodeOption)
}