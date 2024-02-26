import { Component, HostBinding, HostListener, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogState } from '@angular/material/dialog';
import { ZUnoCompilerClass } from '../../ZUnoCompiler';

@Component({
  selector: 'configurator-upload-modal',
  templateUrl: './upload-modal.component.html',
  styleUrls: ['./upload-modal.component.scss'],
})
export class UploadModalComponent implements OnInit {
  private readonly compiler = new ZUnoCompilerClass(this.data.code, this.data.freq, true, 50, (severity: string, message: string) => {
    this.items.push({severity, message})
  });

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

  public ngOnInit(): void {
    this.isLoading = true;
    this.compiler.getWait().then( result => {
        if (result && result.smart_qr && result?.dsk) {
         this.dskHelp = "Use this QR-code to include your device using Z-Wave Smart Start or triple click BTN button";
          this.dsk = result.dsk;
          const qr_code:HTMLElement|null =  document.getElementById("configurator-upload-button_qr-code");
          if (qr_code) {
            this.compiler.drawQR(qr_code, result.smart_qr);
            qr_code.style.display ='';
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
