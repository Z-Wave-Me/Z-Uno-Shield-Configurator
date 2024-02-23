import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'configurator-upload-modal',
  templateUrl: './upload-modal.component.html',
  styleUrls: ['./upload-modal.component.scss'],
})
export class UploadModalComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly data: {items:{severity:string, message: string}[], "dsk_help":string|undefined, "dsk":string|undefined},
    private readonly matDialogRef: MatDialogRef<UploadModalComponent>
  ) {}

  public close(): void {
    this.matDialogRef.close();
  }
}
