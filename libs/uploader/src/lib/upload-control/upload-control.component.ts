import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogState } from '@angular/material/dialog';
import { UploadModalComponent } from '../upload-modal/upload-modal.component';
import { ZUnoCompilerClass, ZUnoCompilerLoadSketchOutProt } from '../../ZUnoCompiler';
import { PreventDirective } from '../prevent/prevent.directive';

@Component({
  selector: 'configurator-upload-control[code]',
  templateUrl: './upload-control.component.html',
  styleUrls: ['./upload-control.component.scss'],
  hostDirectives: [PreventDirective],
})
export class UploadControlComponent {
  private zUnoCompilerClass?: ZUnoCompilerClass;

  private progress_dialog: MatDialogRef<UploadModalComponent>|undefined = undefined;
  // private items:Array<{"severity":string, "message": string}> = [];
  // private b_run:boolean = false;

  public selectedFreq: string = '';

  @Input()
  code: string = '';

  constructor(
    private readonly matDialog: MatDialog,
  ) {
  }

  public getFreqList(): string[] {
    return ZUnoCompilerClass.getFreqList();
  }

  public build(): void {
    this.matDialog.open(UploadModalComponent, {
      disableClose: true,
      data: {
        freq: this.selectedFreq === '' ? null : this.selectedFreq,
        code: this.code,
      },
    });
    // if (this.zUnoCompilerClass != undefined) {
    //   // this.zUnoCompilerClass.cancel();
    //   // this.zUnoCompilerClass = undefined;
    //   if (this.progress_dialog == undefined || this.progress_dialog.getState() != MatDialogState.OPEN) {
    //     this.progress_dialog = this.matDialog.open(UploadModalComponent, {
    //       data: {"items": this.items, "dsk_help": undefined, "dsk": undefined, },
    //     });
    //   }
    //   return ;
    // }
    // this.items = [];
    // let freq:string|null = null;
    // const e = document.getElementById("select_freq_component_id");
    // if (e != null) {
    //   if (ZUnoCompilerClass.getFreqList().includes(e.innerText) == true)
    //     freq = e.innerText;
    // }
    // const self:UploadControlComponent = this;
    // this.zUnoCompilerClass = new ZUnoCompilerClass(this.code, freq, true, 50, (severity: string, message: string) => {
    //   if (this.progress_dialog == undefined || this.progress_dialog.getState() != MatDialogState.OPEN) {
    //     this.progress_dialog = this.matDialog.open(UploadModalComponent, {
    //       data: {"items": [], "dsk_help": undefined, "dsk": undefined, },
    //     });
    //   }
    //   this.items.push({"severity":severity, "message":message});
    //   this.progress_dialog.componentInstance.data.items = this.items;
    // });
    // this.zUnoCompilerClass.getWait().then( result => {
    //     if (self.progress_dialog == undefined || self.progress_dialog.getState() != MatDialogState.OPEN) {
    //       self.progress_dialog = self.matDialog.open(UploadModalComponent, { data: {"items": [], "dsk_help": undefined, "dsk": undefined, },
    //       });
    //     }
    //     if (result != undefined && result["smart_qr"] != undefined && result["dsk"] != undefined) {
    //       self.progress_dialog.componentInstance.data.dsk_help = "Use this QR-code to include your device using Z-Wave Smart Start or triple click BTN button";
    //       self.progress_dialog.componentInstance.data.dsk = result["dsk"];
    //       const qr_code:HTMLElement|null =  document.getElementById("configurator-upload-button_qr-code");
    //       if (qr_code == null || self.zUnoCompilerClass == undefined) {
    //         self.zUnoCompilerClass = undefined;
    //         return ;
    //       }
    //       const res:boolean = self.zUnoCompilerClass.drawQR(qr_code, result["smart_qr"]);
    //       if (res != false) {
    //         qr_code.style.display ='';
    //         self.zUnoCompilerClass = undefined;
    //         return ;
    //       }
    //     }
    //   },
    //   error => {
    //     self.zUnoCompilerClass = undefined;
    //   }
    // );
  }
}
