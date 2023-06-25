import { Directive, ElementRef   } from '@angular/core';

@Directive({
  selector: '[configuratorHost]',
  standalone: true,
})
export class HostDirective {

  constructor(private readonly el: ElementRef) {
    // console.log('show', this.el.nativeElement.id);
  }
}
