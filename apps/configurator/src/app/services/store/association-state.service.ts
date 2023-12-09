import { effect, Injectable, OnDestroy, Signal, signal } from '@angular/core';
import { PinsStateService } from './pins-state.service';
import { filter, Subject, takeUntil } from 'rxjs';
import { Association } from '@configurator/shared';


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

    this.pinsStateService.boardConfig$.pipe(
      takeUntil(this.destroy$),
      filter(state => !state.associations.length),
    ).subscribe(state => {
      this.state.set(state.associations);
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
