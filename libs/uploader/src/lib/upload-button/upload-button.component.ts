import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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

  private readonly zUnoCompiler = ZUnoCompiler()
  constructor(
    private readonly matDialog: MatDialog
  ) {
    this.zUnoCompiler.setProgress((severity: 'error', message: any) => {
      this.matDialog.open(UploadModalComponent, {
        data: {
          severity,
          message
        }
      });
    })
  }

  public build(): void {
    this.zUnoCompiler.compile(this.code, null, true, 50).catch(() => {});


  }
}
