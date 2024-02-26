import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[configuratorPrevent]',
  standalone: true,
})
export class PreventDirective {
  @HostListener('click', ['$event'])
  clickEvent(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
  }
}
