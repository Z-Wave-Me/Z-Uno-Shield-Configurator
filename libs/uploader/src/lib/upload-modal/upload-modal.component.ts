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
    if (severity === "error" && this.compiler.errorComplite() == true)
        this.report = "Report to Z-Wave.Me";
    const str_array:Array<string> = message.split("\n");
    let i:number = 0x0;
    while (i < str_array.length) {
        this.items.push({severity, "message":str_array[i]})
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
  public report: string|undefined = undefined;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly data: UploadModalComponentDetails,
    private readonly matDialogRef: MatDialogRef<UploadModalComponent>
  ) {}

  public close(): void {
    this.compiler.cancel();
    this.matDialogRef.close();
  }

  public report_fun(): void {
    const xhr = new XMLHttpRequest();
    const self:UploadModalComponent = this;

    this.report = undefined;
    new Promise(function(resolve, reject) {
        const formData = new FormData();

        formData.append("sketch", new File([new Blob([self.data.code])], "sketch", { lastModified: Date.now(), type: "text/x-arduino"}));
        formData.append("log", new File([new Blob([self.getClipboardTxt()])], "log", { lastModified: Date.now(), type: "text/x-arduino"}));
        formData.append("referer", document.location.href);
        const url = 'https://service.z-wave.me/z-uno-compilation-server/report/';
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

  public getClipboardTxt(): string {
    let i:number, str:string;
    i = 0x0;
    str = "";
    while (i < this.items.length) {
        str = str + this.items[i].message + "\n";
        i++;
    }
    if (this.dskHelp !== "")
        str = str + this.dskHelp + "\n";
    if (this.dsk !== "")
        str = str + this.dsk + "\n";
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
