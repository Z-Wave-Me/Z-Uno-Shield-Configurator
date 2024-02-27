import { AfterViewInit, Component, ElementRef, HostBinding, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ZUnoCompilerClass } from '../../ZUnoCompiler';

@Component({
  selector: 'configurator-upload-modal',
  templateUrl: './upload-modal.component.html',
  styleUrls: ['./upload-modal.component.scss'],
})
export class UploadModalComponent implements AfterViewInit {
  private readonly compiler = new ZUnoCompilerClass(this.data.code, this.data.freq, true, 50, (severity: string, message: string) => {
    const str_array:Array<string> = message.split("\n");
    let i:number = 0x0;
    while (i < str_array.length) {
        this.items.push({severity, "message":str_array[i]})
        console.log(str_array[i]);
        i++;
    }
  });

  @ViewChild('qr')
  public qr!: ElementRef<HTMLElement>;

  @HostBinding('class.loading')
  public get loading() {
    return this.isLoading;
  }

  public isLoading = false;
  public items: Severity[] = [];
  public dskHelp: string = '';
  public dsk: string = '';
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly data: UploadModalComponentDetails,
    private readonly matDialogRef: MatDialogRef<UploadModalComponent>
  ) {}

  public close(): void {
    this.compiler.cancel();
    this.matDialogRef.close();
  }

  public getClipboardTxt(): string {
    let i:number, str:string;
    i = 0x0;
    str = "";
    while (i < this.items.length) {
        str = str + this.items[i].message + "\n";
        i++;
    }
    return (str);
  }

  ngAfterViewInit(): void {
    this.isLoading = true;
    this.compiler.getWait().then( result => {
        if (result && result.smart_qr && result?.dsk) {
          this.dskHelp = "Use this QR-code to include your device using Z-Wave Smart Start or triple click BTN button";
          this.dsk = result.dsk;
          const qrCode = this.qr.nativeElement;
          if (qrCode) {
            this.compiler.drawQR(qrCode, result.smart_qr);
            qrCode.style.display = '';
          }
        }
      },
    ).finally(() => {
      this.isLoading = false;
    });
  }
}

export interface UploadModalComponentDetails {
  code: string;
  freq: string;
}

export interface Severity {
  severity:string;
  message: string;
}
