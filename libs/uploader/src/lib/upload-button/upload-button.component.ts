import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogState } from '@angular/material/dialog';
import { UploadModalComponent } from '../upload-modal/upload-modal.component';
import { ZUnoCompiler } from '../z-uno-compiler';

@Component({
  selector: 'configurator-upload-button',
  templateUrl: './upload-button.component.html',
  styleUrls: ['./upload-button.component.scss'],
})
export class UploadButtonComponent {
  @Input()
  code: string = '';

  private zUnoCompilerDialogProgress: MatDialogRef<UploadModalComponent>|undefined = undefined;
  private readonly zUnoCompiler = ZUnoCompiler()
  constructor(
    private readonly matDialog: MatDialog,
  ) {
    this.zUnoCompiler.setProgress((severity: string, message: string) => {
      if (this.zUnoCompilerDialogProgress == undefined || this.zUnoCompilerDialogProgress.getState() != MatDialogState.OPEN) {
        this.zUnoCompilerDialogProgress = this.matDialog.open(UploadModalComponent, {
        data: {
          "message":"",
        },
      });
    }
    this.zUnoCompilerDialogProgress.componentInstance.data.message += '<span style="color:' + (severity === "error" ? "red" : "green") + '">' + message + '</span><br>';
    const id_dialog:HTMLElement|null = document.getElementById(this.zUnoCompilerDialogProgress.id);
    if (id_dialog == null)
      return ;
    id_dialog.style.cursor = severity === "error" ? "auto" : "progress";
    })
  }

  public build(): void {
    this.zUnoCompiler.compile(this.code, null, true, 50).catch(() => {});


  }
}
