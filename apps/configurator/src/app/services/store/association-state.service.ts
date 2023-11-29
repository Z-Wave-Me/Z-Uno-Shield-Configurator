import { effect, Injectable, OnDestroy, Signal, signal } from '@angular/core';
import { PinsStateService } from './pins-state.service';
import { Association } from '@configurator/arduino-code-gen';
import { Subject, takeUntil } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class AssociationStateService implements OnDestroy {
  private readonly destroy$: Subject<void> = new Subject<void>();
  private readonly state = signal<Association[]>([]);

  constructor(
    private readonly pinsStateService: PinsStateService,
  ) {
    this.state.set(this.pinsStateService.snapshot.associations);

    effect(() => {
      this.pinsStateService.updateAssociations(this.state());
    });

    this.pinsStateService.state$.pipe(
      takeUntil(this.destroy$),
    ).subscribe(state => {
      if (!state.associations.length) {
        this.state.set(state.associations);
      }
    });
  }

  public ngOnDestroy(): void {
   this.destroy$.next();
   this.destroy$.complete();
  }

  public update(association: Association, index: number): void {
    this.state.mutate((associations) => (associations[index] = association));
  }

  public remove(index: number): void {
    this.state.update((rules) => rules.filter((_, i) => i !== index));
  }

  public associations(): Signal<Association[]> {
    return this.state.asReadonly();
  }
}
