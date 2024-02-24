import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadButtonComponent } from './upload-button/upload-button.component';
import { UploadModalComponent } from './upload-modal/upload-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';

import { NoSanitizePipe } from './nosanitizerpipe';
import { SelectFreq } from './select_freq/select_freq.component';


@NgModule({
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatTooltipModule, MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule],
  declarations: [UploadButtonComponent, UploadModalComponent, NoSanitizePipe, SelectFreq],
  exports: [
    UploadButtonComponent, SelectFreq ]
})
export class UploaderModule {}
