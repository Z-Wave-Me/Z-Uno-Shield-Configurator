import { Directive, ElementRef, HostBinding, HostListener, Input, OnDestroy } from '@angular/core';
import { PinSelectedService } from '../../../services/pin-selected/pin-selected.service';
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
      ({ id }) => (this.active = this.configuratorHighlightPin === id),
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  @HostListener('mouseenter')
  public onMouseOver(): void {
    // здесь выполняется ваша функция при наведении на элемент
    this.pinSelectedService.select({ id: this.configuratorHighlightPin });
    console.log('Mouse over', this.configuratorHighlightPin);
  }

  @HostListener('click')
  public click(): void {}

  @HostBinding('class.--active')
  private active = false;
}
