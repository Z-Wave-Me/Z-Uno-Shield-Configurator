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


import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';
import { Store } from '@configurator/arduino-code-gen';
import { Association } from '@configurator/arduino-code-gen';


@Injectable({
  providedIn: 'root',
})
export class PinsStateService {
  private readonly _state$ = new BehaviorSubject<Store>({
    pins: [],
    associations: [],
  });

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
        const data = JSON.parse(decompressFromEncodedURIComponent(decodeURIComponent(config)));
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
        const config = { pins: [], associations: [], ...(this.localStorageService.get<Store>(key) ?? {}) };
        this._state$.next(config);
        this.updateRoute();
      });
  }

  public get snapshot(): Store {
    return this._state$.value;
  }

  public get state$(): Observable<Store> {
    return this._state$.asObservable();
  }

  public patch(pin: PinConfig, possiblePins: Pin[]): void {
    const state = this._state$.value;
    const value = state.pins;

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

      if (!value.some(item => item.id === pin.id)) {
        updated.push(pin);
      }
    }

    this._state$.next({...state, pins: updated });

    console.group('Store');
    console.log(this.snapshot);
    console.groupEnd();

    this.updateRoute();
  }


  public reset(): void {
    this._state$.next({
      pins: [],
      associations: [],
    });
    this.localStorageService.set(this.currentKey, {
      pins: [],
      associations: [],
    });
    this.router.navigate([]);
  }

  private updateRoute(): void {
    const config = this.snapshot;
    const configBase64 = compressToEncodedURIComponent(JSON.stringify(config, (key, value) => value === null || value === undefined ? undefined : value));
    this.localStorageService.set(this.currentKey, config);

    const query = this.router.createUrlTree([], {relativeTo: this.activatedRoute, queryParams: {config: configBase64}}).toString();

    this.location.go(query);
  }

  private isLinked(group?: string): boolean {
    return group ? /\[linked]/.test(group) : false;
  }

  public switchIndexes(data: { from: number; to: number }): void {
    const state =  this.snapshot;
    const value = state.pins;
    const pin = value[data.from];
    value[data.from] = value[data.to];
    value[data.to] = pin;

    this._state$.next({ ...state, pins: value });
    this.updateRoute();
  }

  public updateAssociations(associations: Association[]): void {
    const state = this.snapshot;

    if (!(state.associations.length === 0 && associations.length === 0)) {
      this._state$.next({ ...state, associations });
      this.updateRoute();
    }
  }
}
