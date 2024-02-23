import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogState } from '@angular/material/dialog';
import { UploadModalComponent } from '../upload-modal/upload-modal.component';
import { ZUnoCompiler, ZUnoCompilerLoadSketchOutProt } from '../z-uno-compiler';
import { QRCode } from '../qrcode';

@Component({
  selector: 'configurator-upload-button',
  templateUrl: './upload-button.component.html',
  styleUrls: ['./upload-button.component.scss'],
})
export class UploadButtonComponent {
  @Input()
  code: string = '';

  private readonly zUnoCompiler = ZUnoCompiler()
  private progress_dialog: MatDialogRef<UploadModalComponent>|undefined = undefined;
  private items:Array<{"severity":string, "message": string}> = [];
  private b_run:boolean = false;
  constructor(
    private readonly matDialog: MatDialog,
  ) {
    this.zUnoCompiler.setProgress((severity: string, message: string) => {
      if (this.progress_dialog == undefined || this.progress_dialog.getState() != MatDialogState.OPEN) {
        this.progress_dialog = this.matDialog.open(UploadModalComponent, {
        data: {"items": [], "dsk_help": undefined, "dsk": undefined, },
      });
    }
    this.items.push({"severity":severity, "message":message});
    this.progress_dialog.componentInstance.data.items = this.items;
    })
  }

  public build(): void {
    if (this.b_run == true) {
      if (this.progress_dialog == undefined || this.progress_dialog.getState() != MatDialogState.OPEN) {
        this.progress_dialog = this.matDialog.open(UploadModalComponent, {
        data: {"items": this.items, "dsk_help": undefined, "dsk": undefined, },
      });
      }
      return ;
    }
    this.b_run = true;
    this.items = [];
    let freq:string|null = null;
    const e = document.getElementById("select_freq_component_id");
    if (e != null) {
        if (this.zUnoCompiler.getFreqList().includes(e.innerText) == true)
            freq = e.innerText;
    }

    const res:Promise<ZUnoCompilerLoadSketchOutProt|void> = this.zUnoCompiler.compile(this.code, freq, true, 50);
    const self:UploadButtonComponent = this;
    res.then( result => {
        self.b_run = false;
        if (self.progress_dialog == undefined || self.progress_dialog.getState() != MatDialogState.OPEN) {
          self.progress_dialog = self.matDialog.open(UploadModalComponent, { data: {"items": [], "dsk_help": undefined, "dsk": undefined, },
          });
        }
        if (result != undefined && result["smart_qr"] != undefined && result["dsk"] != undefined) {
          self.progress_dialog.componentInstance.data.dsk_help = "Use this QR-code to include your device using Z-Wave Smart Start or triple click BTN button";
          self.progress_dialog.componentInstance.data.dsk = result["dsk"];
          const qr_code:HTMLElement|null =  document.getElementById("configurator-upload-button_qr-code");
          if (qr_code == null)
            return ;
          const res:QRCode|null = self.zUnoCompiler.drawQR(qr_code, result["smart_qr"]);
          if (res != null) {
            qr_code.style.display ='';
            return ;
          }
        }
      },
      error => {
        self.b_run = false;
      }
    );
  }
}
