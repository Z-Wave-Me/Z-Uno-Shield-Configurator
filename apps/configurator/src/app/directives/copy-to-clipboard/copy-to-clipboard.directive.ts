import {Directive, HostListener} from '@angular/core';
import {NotificationService} from "../../services/notification/notification.service";

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[cdkCopyToClipboard]',
  standalone: true,
})
export class CopyToClipboardDirective {
  constructor(private readonly notificationService:  NotificationService) {
  }
  @HostListener('click', ['$event'])
  public onClick(): void {
    this.notificationService.show($localize `Copied to clipboard`)
  }
}
