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
  private readonly zUnoCompilerClass = new ZUnoCompilerClass((severity: string, message: string) => {
    this.items.push({severity, message});

    if (this.progress_dialog == undefined || this.progress_dialog.getState() != MatDialogState.OPEN) {
      this.progress_dialog = this.matDialog.open(UploadModalComponent, {
        data: {
          items: this.items
        },
      });
    }
  });

  private progress_dialog: MatDialogRef<UploadModalComponent>|undefined = undefined;
  private items:Array<{"severity":string, "message": string}> = [];
  private b_run:boolean = false;

  public selectedFreq: string = "Keep current frequency";

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
      if (ZUnoCompilerClass.getFreqList().includes(e.innerText) == true)
        freq = e.innerText;
    }

    const res:Promise<ZUnoCompilerLoadSketchOutProt|void> = this.zUnoCompilerClass.compile(this.code, freq, true, 50);
    res.then( result => {
        this.b_run = false;
        if (this.progress_dialog == undefined || this.progress_dialog.getState() != MatDialogState.OPEN) {
          this.progress_dialog = this.matDialog.open(UploadModalComponent, { data: {"items": [], "dsk_help": undefined, "dsk": undefined, },
          });
        }
        if (result != undefined && result["smart_qr"] != undefined && result["dsk"] != undefined) {
          this.progress_dialog.componentInstance.data.dsk_help = "Use this QR-code to include your device using Z-Wave Smart Start or triple click BTN button";
          this.progress_dialog.componentInstance.data.dsk = result["dsk"];
          const qr_code:HTMLElement|null =  document.getElementById("configurator-upload-button_qr-code");
          if (qr_code == null)
            return ;
          const res:boolean = this.zUnoCompilerClass.drawQR(qr_code, result["smart_qr"]);
          if (res != false) {
            qr_code.style.display ='';
            return ;
          }
        }
      },
      error => {
        this.b_run = false;
      }
    );
  }
}
