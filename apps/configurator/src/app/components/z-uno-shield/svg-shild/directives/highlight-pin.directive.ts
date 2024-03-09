import { Directive, HostBinding, HostListener, Input, OnDestroy } from '@angular/core';
import { PinSelectedService } from '../../../../services/pin-selected/pin-selected.service';
import { PinsStateService } from '../../../../services/store/pins-state.service';

@Directive({
  selector: '[configuratorHighlightPin]',
  standalone: true,
})
export class HighlightPinDirective {

  @Input()
  public configuratorHighlightPin!: string;

  constructor(
    private readonly pinSelectedService: PinSelectedService,
    private readonly pinsStateService: PinsStateService,
    ) { }

  @HostListener('mouseenter')
  public onMouseOver(): void {
    this.pinSelectedService.select(this.configuratorHighlightPin);
  }

  @HostListener('click')
  public click(): void {}

  @HostBinding('class.--active')
  private get active(): boolean {
    return !!this.pinsStateService.snapshot.pins.find(pin => pin.id === this.configuratorHighlightPin);
  };
}
