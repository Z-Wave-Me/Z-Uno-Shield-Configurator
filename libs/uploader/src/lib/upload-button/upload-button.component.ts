import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogState } from '@angular/material/dialog';
import { UploadModalComponent } from '../upload-modal/upload-modal.component';
import { ZUnoCompilerClass} from '../../ZUnoCompiler/src/z-uno-compiler';

@Component({
  selector: 'configurator-upload-button',
  templateUrl: './upload-button.component.html',
  styleUrls: ['./upload-button.component.scss'],
})
export class UploadButtonComponent {
  @Input()
  code: string = '';

  private zUnoCompilerClass:ZUnoCompilerClass|undefined = undefined;

  private progress_dialog: MatDialogRef<UploadModalComponent>|undefined = undefined;
  private items:Array<{"severity":string, "message": string}> = [];
  constructor(
    private readonly matDialog: MatDialog,
  ) {
  }

  public build(): void {
  //   if (this.zUnoCompilerClass != undefined) {
  //       // this.zUnoCompilerClass.cancel();
  //       // this.zUnoCompilerClass = undefined;
  //       if (this.progress_dialog == undefined || this.progress_dialog.getState() != MatDialogState.OPEN) {
  //           this.progress_dialog = this.matDialog.open(UploadModalComponent, {
  //           data: {"items": this.items, "dsk_help": undefined, "dsk": undefined, },
  //         });
  //         }
  //         return ;
  //   }
  //   this.items = [];
  //   let freq:string|null = null;
  //   const e = document.getElementById("select_freq_component_id");
  //   if (e != null) {
  //       if (ZUnoCompilerClass.getFreqList().includes(e.innerText) == true)
  //           freq = e.innerText;
  //   }
  //   const self:UploadButtonComponent = this;
  //   this.zUnoCompilerClass = new ZUnoCompilerClass(this.code, freq, true, 50, (severity: string, message: string) => {
  //       if (this.progress_dialog == undefined || this.progress_dialog.getState() != MatDialogState.OPEN) {
  //         this.progress_dialog = this.matDialog.open(UploadModalComponent, {
  //         data: {"items": [], "dsk_help": undefined, "dsk": undefined, },
  //       });
  //     }
  //     this.items.push({"severity":severity, "message":message});
  //     });
  //   this.zUnoCompilerClass.getWait().then( result => {
  //
  //       if (result && result.smart_qr && resul.dsk) {
  //         self.progress_dialog.componentInstance.data.dsk_help = "Use this QR-code to include your device using Z-Wave Smart Start or triple click BTN button";
  //         self.progress_dialog.componentInstance.data.dsk = result["dsk"];
  //         const qr_code:HTMLElement|null =  document.getElementById("configurator-upload-button_qr-code");
  //         if (qr_code == null || self.zUnoCompilerClass == undefined) {
  //           self.zUnoCompilerClass = undefined;
  //           return ;
  //         }
  //         const res:boolean = self.zUnoCompilerClass.drawQR(qr_code, result["smart_qr"]);
  //         if (res != false) {
  //           qr_code.style.display ='';
  //           self.zUnoCompilerClass = undefined;
  //           return ;
  //         }
  //       }
  //     },
  //     error => {
  //       self.zUnoCompilerClass = undefined;
  //     }
  //   );
  }
}