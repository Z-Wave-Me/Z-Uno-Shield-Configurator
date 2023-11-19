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
import { Location } from '@angular/common';
import {
  compressToUTF16,
  decompressFromUTF16,
} from 'lz-string';

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
    private readonly location: Location,
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
        const data = JSON.parse(decompressFromUTF16(decodeURIComponent(config)));
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

  public patch(pin: PinConfig, possiblePins: Pin[]): void {
    const value = this._state$.value;

    const groupType = pin.group;
    const groupPinIds = possiblePins
      .filter(({ id, pin: pinConfig }) =>
        id !== pin.id
        && this.isLinked(groupType)
        && pinConfig.some((item) => item.group === groupType),
      )
      .map(({ id }) => id);

    let updated: PinConfig[];

    if (pin.device?.remove) {
      updated = value.filter(({ id }) => !(id === pin.id || groupPinIds.includes(id)));
    } else {
      updated = value.map(item => {
        if (item.id === pin.id || groupPinIds.includes(item.id)) {
          return { ...item, ...pin, device: { ...item.device, ...pin.device } };
        }

        return item;
      });

      if (!value.some(item => item.id === pin.id)) {
        updated.push(pin);
      }

      if (this.isLinked(groupType)) {
        groupPinIds.forEach(groupId => {
          if (!updated.some(item => item.id === groupId)) {
            updated.push({
              ...pin,
              device: { ...pin.device },
              id: groupId,
            });
          }
        });
      }
    }

    this._state$.next(updated);

    // console.group('Store');
    // console.log(this.snapshot);
    // console.groupEnd();

    this.updateRoute();
  }


  public reset(): void {
    this._state$.next([]);
    this.localStorageService.set(this.currentKey, []);
    this.router.navigate([]);
  }

  private updateRoute(): void {
    const config = this.snapshot;
    const configBase64 = compressToUTF16(JSON.stringify(config, (key, value) => value === null || value === undefined ? undefined : value));
    this.localStorageService.set(this.currentKey, config);

    const query = this.router.createUrlTree([], {relativeTo: this.activatedRoute, queryParams: {config: configBase64}}).toString();

    this.location.go(query);
  }

  private isLinked(group?: string): boolean {
    return group ? /\[linked]/.test(group) : false;
  }

  public switchIndexes(data: { from: number; to: number }): void {
    const value = this.snapshot;
    const pin = value[data.from];
    value[data.from] = value[data.to];
    value[data.to] = pin;

    this._state$.next(value);
    this.updateRoute();
  }
}
