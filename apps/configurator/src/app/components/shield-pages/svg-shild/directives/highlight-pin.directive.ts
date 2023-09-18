import { Directive, ElementRef, HostBinding, HostListener, Input, OnDestroy } from '@angular/core';
import { PinSelectedService } from '../../../../services/pin-selected/pin-selected.service';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[configuratorHighlightPin]',
  standalone: true,
})
export class HighlightPinDirective implements OnDestroy {

  private subscription: Subscription;

  @Input()
  public configuratorHighlightPin!: string;

  constructor(private readonly pinSelectedService: PinSelectedService) {
    this.subscription = this.pinSelectedService.selectObserver.subscribe(
      (pinId) => (this.active = this.configuratorHighlightPin === pinId),
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  @HostListener('mouseenter')
  public onMouseOver(): void {
    this.pinSelectedService.select(this.configuratorHighlightPin);
    console.log('Mouse over', this.configuratorHighlightPin);
  }

  @HostListener('click')
  public click(): void {}

  @HostBinding('class.--active')
  private active = false;
}
