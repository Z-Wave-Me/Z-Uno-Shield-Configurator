import { effect, Injectable, OnDestroy, Signal, signal } from '@angular/core';
import { PinsStateService } from './pins-state.service';
import { distinctUntilChanged, filter, map, Subject, switchMap, takeUntil } from 'rxjs';
import { Association, BoardConfig } from '@configurator/shared';
import { NavigationEnd, Router } from '@angular/router';


@Injectable({
  providedIn: 'root',
})
export class AssociationStateService implements OnDestroy {
  private readonly destroy$: Subject<void> = new Subject<void>();
  private readonly state = signal<Association[]>([]);

  constructor(
    private readonly pinsStateService: PinsStateService,
    private readonly router: Router,
  ) {
    effect(() => {
      this.pinsStateService.updateAssociations(this.state());
    });

    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        ),
        map(({ url }) => url.split('?')[0].split('/')[1]),
        filter(Boolean),
        distinctUntilChanged(),
        switchMap(() => this.pinsStateService.boardConfig$),
      )
      .subscribe(({ associations  }) => {
        this.state.set(associations);
      });

    console.log(this.pinsStateService.snapshot.associations);
    // this.state.set(this.pinsStateService.snapshot.associations);


    // this.pinsStateService.boardConfig$.pipe(
    //   takeUntil(this.destroy$),
    //   filter(state => !state.associations.length),
    // ).subscribe(state => {
    //   this.state.set(state.associations);
    // });
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
