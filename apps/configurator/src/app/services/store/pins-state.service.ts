import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  distinctUntilChanged,
  filter,
  first,
  map,
  Observable,
} from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { LocalStorageService } from './local-storage.service';
import { PinConfig } from '@configurator/shared';
import { Pin } from '../../components/z-uno-shield/z-uno-shield.model';

@Injectable({
  providedIn: 'root',
})
export class PinsStateService {
  private readonly _state$ = new BehaviorSubject<PinConfig[]>([]);

  private currentKey = '';

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly localStorageService: LocalStorageService,
  ) {
    this.activatedRoute.queryParams
      .pipe(
        first(),
        map((data) => data['config']),
        filter(Boolean),
      )
      .subscribe((config) => {
        const key = this.router.url.split('?')[0].split('/')[1];
        this.currentKey = key;
        const data = JSON.parse(atob(decodeURIComponent(config)));
        this._state$.next(data);
        this.localStorageService.set(key, data);
      });

    router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd,
        ),
        map(({ url }) => url.split('?')[0].split('/')[1]),
        filter(Boolean),
        distinctUntilChanged(),
      )
      .subscribe((key) => {
        this.currentKey = key;
        const config = this.localStorageService.get<PinConfig[]>(key) ?? [];
        this._state$.next(config);
        this.updateRoute();
      });
  }

  public get snapshot(): PinConfig[] {
    return this._state$.value;
  }

  public get state$(): Observable<PinConfig[]> {
    return this._state$.asObservable();
  }

  public patch(pin: PinConfig, possiblePins: Pin[]): Promise<boolean> {
    const value = this._state$.value;

    const groupType = pin.group;
    const groupPinIds = possiblePins
      .filter(
        ({ id, pin: pinConfig }) =>
          id !== pin.id
          && this.isLinked(groupType)
          && pinConfig.some((item) => item.group === groupType),
      )
      .map(({ id }) => id);

    const updated = value.filter(
      ({ id }) =>
        !(
          id === pin.id
          || (this.isLinked(groupType) && groupPinIds.includes(id))
        ),
    );

    if (!pin.device?.remove) {
      updated.push(pin);

      if (this.isLinked(groupType)) {
        updated.push(
          ...groupPinIds.map((id) => ({
            ...pin,
            device: { ...pin.device },
            id,
          })),
        );
      }
    }

    this._state$.next(updated);
    console.group('Store');
    console.log(this.snapshot);
    console.groupEnd();

    return this.updateRoute();
  }

  public reset(): void {
    this._state$.next([]);
    this.localStorageService.set(this.currentKey, []);
    this.router.navigate([]);
  }

  private updateRoute(): Promise<boolean> {
    const config = this.snapshot;
    const configBase64 = btoa(JSON.stringify(config));

    this.localStorageService.set(this.currentKey, config);

    return this.router.navigate([], {
      queryParams: { config: configBase64 },
      queryParamsHandling: 'merge',
    });
  }

  private isLinked(group?: string): boolean {
    return group ? /\[linked]/.test(group) : false;
  }
}
