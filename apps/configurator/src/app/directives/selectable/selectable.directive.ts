import { Directive, HostBinding, Input, OnDestroy} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { PinContainer, PinSelectedService } from '../../services/pin-selected/pin-selected.service';

@Directive({
  selector: '[configuratorSelectable][options]',
  standalone: true,
})
export class SelectableDirective implements OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private currentPin?: PinContainer;

  @Input()
  public options: any;

  @HostBinding('class.pin-selected')
  public get selected(): boolean {
    return this.currentPin?.id === this.options?.id;
  }

  constructor(private readonly pinSelectedService: PinSelectedService) {
    this.pinSelectedService.selectObserver.pipe(
      takeUntil(this.destroy$),
    ).subscribe(
      (pin) => this.currentPin = pin,
    )
  }


  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
