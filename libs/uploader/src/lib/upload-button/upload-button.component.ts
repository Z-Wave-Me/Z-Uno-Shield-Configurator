import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogState } from '@angular/material/dialog';
import { UploadModalComponent } from '../upload-modal/upload-modal.component';
import { ZUnoCompiler } from '../z-uno-compiler';

function _style_cursor_change(id:string, severity: string): void {
  const id_dialog:HTMLElement|null = document.getElementById(id);
  if (id_dialog == null)
    return ;
  id_dialog.style.cursor = severity === "error" ? "auto" : "progress";
}

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
          severity,
          message,
        },
      });
      _style_cursor_change(this.zUnoCompilerDialogProgress.id, severity);
      return ;
    }
    this.zUnoCompilerDialogProgress.componentInstance.data.message += "<br />" + message;
    _style_cursor_change(this.zUnoCompilerDialogProgress.id, severity);
    })
  }

  public build(): void {
    this.zUnoCompiler.compile(this.code, null, true, 50).catch(() => {});


  }
}
