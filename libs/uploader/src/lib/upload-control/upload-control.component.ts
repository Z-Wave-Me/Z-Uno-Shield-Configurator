import { Component, Input } from '@angular/core';
import { MatDialog} from '@angular/material/dialog';
import { UploadModalComponent } from '../upload-modal/upload-modal.component';
import { ZUnoCompilerClass } from '../../ZUnoCompiler';
import { PreventDirective } from '../prevent/prevent.directive';

@Component({
  selector: 'configurator-upload-control[code]',
  templateUrl: './upload-control.component.html',
  styleUrls: ['./upload-control.component.scss'],
  hostDirectives: [PreventDirective],
})
export class UploadControlComponent {

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
  }
}
