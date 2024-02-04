import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadButtonComponent } from './upload-button/upload-button.component';
import { UploadModalComponent } from './upload-modal/upload-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatTooltipModule],
  declarations: [UploadButtonComponent, UploadModalComponent],
  exports: [
    UploadButtonComponent
  ]
})
export class UploaderModule {}
