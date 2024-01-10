import { effect, Injectable, OnDestroy, Signal, signal } from '@angular/core';
import { PinsStateService } from './pins-state.service';
import { distinctUntilChanged, filter, map, Subject } from 'rxjs';
import { Association } from '@configurator/shared';
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

    this.state.set(this.pinsStateService.snapshot.associations);

    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        ),
        map(({ url }) => url.split('?')[0].split('/')[1]),
        filter(Boolean),
        distinctUntilChanged(),
        map(() => this.pinsStateService.snapshot),
      )
      .subscribe(({ associations  }) => {
        this.state.set(associations);
      });


    effect(() => {
      this.pinsStateService.updateAssociations(this.state());
    });
  }

  public ngOnDestroy(): void {
   this.destroy$.next();
   this.destroy$.complete();
  }

  public update(association: Association, index: number): void {
    
    const actions = association.actions.map(a => {
      const template = a.template;

      return { ...a, template: template.replace('{1}', index.toString()), title:  a.title + ` ${index + 1}` };
    });
    
    
    this.state.mutate(
      (associations) => (associations[index] = { ...association, actions }),
    );
  }

  public remove(index: number): void {
    this.state.update((rules) => rules.filter((_, i) => i !== index));
  }

  public associations(): Signal<Association[]> {
    return this.state.asReadonly();
  }
}
