import { Injectable } from '@angular/core';
import {
  BehaviorSubject, config,
  distinctUntilChanged,
  filter,
  first,
  map,
  Observable, ReplaySubject, Subject, takeUntil
} from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { LocalStorageService } from './local-storage.service';
import { Association, PinConfig, BoardConfig, Rule } from '@configurator/shared';
import { Pin } from '../../components/z-uno-shield/z-uno-shield.model';
import { Location } from '@angular/common';
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';
import { generate, GeneratedData } from '@configurator/arduino-code-gen';


@Injectable({
  providedIn: 'root',
})
export class PinsStateService {
  private readonly _boardConfig$ = new BehaviorSubject<BoardConfig>({
    pins: [],
    associations: [],
    rules: [],
  });

  private readonly codeGen$ = new ReplaySubject<GeneratedData>(1);

  private readonly initialState: BoardConfig = {
    pins: [],
    associations: [],
    rules: [],
  }
  private currentKey = '';

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly localStorageService: LocalStorageService,
    private readonly location: Location,
  ) {
    this.init();
  }

  public code(): Observable<string|undefined> {
    return this.codeGen$.asObservable().pipe(
      map(data => data.code),
    )
  }


  public get snapshot(): BoardConfig {
    return this._boardConfig$.value;
  }

  public get boardConfig$(): Observable<BoardConfig> {
    return this._boardConfig$.asObservable();
  }

  public rules(): Observable<Rule[]> {
    return this._boardConfig$.pipe(map(state => state.rules));
  }

  public patchRules(rule: Rule): void {

  }

  public removeRule(id: string): void {
    const { rules, ...other } = this.snapshot;
    this._boardConfig$.next({...other, rules: rules.filter(rule => rule.id !== id)});
  }

  public patchDeviceConfig(pin: PinConfig, possiblePins: Pin[]): void {
    const state = this._boardConfig$.value;
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

    this._boardConfig$.next({...state, pins: updated });

    console.group('Store');
    console.log(this.snapshot);
    console.groupEnd();

    this.updateRoute();
  }


  public reset(): void {
    this._boardConfig$.next(this.initialState);
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

    this._boardConfig$.next({ ...state, pins: value });
    this.updateRoute();
  }

  public updateAssociations(associations: Association[]): void {
    const state = this.snapshot;

    if (!(state.associations.length === 0 && associations.length === 0)) {
      this._boardConfig$.next({ ...state, associations });
      this.updateRoute();
    }
  }

  private init(): void {
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
        this._boardConfig$.next(data);
        this.localStorageService.set(key, data);
      });

    this.router.events
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
        const config = { ...this.initialState, ...(this.localStorageService.get<BoardConfig>(key) ?? {}) };
        this._boardConfig$.next(config);
        this.updateRoute();
      });

    this.boardConfig$.subscribe(config => {
      const generated = generate(config);
      this.codeGen$.next(generated);
    })
  }
}
