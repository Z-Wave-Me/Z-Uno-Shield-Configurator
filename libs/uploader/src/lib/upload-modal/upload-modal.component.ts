import { Component, Inject, OnInit } from '@angular/core';
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

  public items: Severity[] = [];
  public dsk_help: string = '';
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
    // const compiler = new ZUnoCompilerClass(this.data.code, this.data.freq, true, 50, (severity: string, message: string) => {
    //   this.items.push({severity, message})
    //   // if (this.progress_dialog == undefined || this.progress_dialog.getState() != MatDialogState.OPEN) {
    //   //   this.progress_dialog = this.matDialog.open(UploadModalComponent, {
    //   //     data: {"items": [], "dsk_help": undefined, "dsk": undefined, },
    //   //   });
    //   // }
    //   // this.items.push({"severity":severity, "message":message});
    //   // this.progress_dialog.componentInstance.data.items = this.items;
    // });
    this.compiler.getWait().then( result => {
        if (result && result.smart_qr && result?.dsk) {
         this.dsk_help = "Use this QR-code to include your device using Z-Wave Smart Start or triple click BTN button";
          this.dsk = result.dsk;
          const qr_code:HTMLElement|null =  document.getElementById("configurator-upload-button_qr-code");
          // if (qr_code == null || self.zUnoCompilerClass == undefined) {
          //   self.zUnoCompilerClass = undefined;
          //   return ;
          // }
          if (qr_code) {
            this.compiler.drawQR(qr_code, result.smart_qr);
            qr_code.style.display =''
          }
          // if (res != false) {
          //   qr_code.style.display ='';
          //   self.zUnoCompilerClass = undefined;
          //   return ;
          // }
        }
      },
      error => {
        // self.zUnoCompilerClass = undefined;
      }
    );
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
