import { Directive, HostListener, Inject, Input } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Directive({
  selector: '[configuratorSaveAsFile]',
  standalone: true,
})
export class SaveAsFileDirective {
  @Input()
  public configuratorSaveAsFile = '';

  constructor(
    @Inject(DOCUMENT)
    private readonly document: Document,
    ) {}

  @HostListener('click')
  public download(): void {
    const a = this.document.createElement('a');
    const blob = new Blob([this.configuratorSaveAsFile], { type: 'octet/stream' });
    a.href = window.URL.createObjectURL(blob);
    a.download = 'ShieldConfigurator.ino';
    a.click();
  }
}
