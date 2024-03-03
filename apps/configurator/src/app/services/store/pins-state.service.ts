import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  Subject,
} from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { LocalStorageService } from './local-storage.service';
import { Association, PinConfig, BoardConfig, Rule, Action } from '@configurator/shared';
import { Pin } from '../../components/z-uno-shield/z-uno-shield.model';
import { Location } from '@angular/common';
import { generate, GeneratedData } from '@configurator/arduino-code-gen';
import { ServerSyncService } from './server-sync.service';


@Injectable({
  providedIn: 'root',
})
export class PinsStateService {
  private readonly initialState: BoardConfig = {
    pins: [],
    associations: [],
    rules: null,
    remoteUrl: null,
  };

  private readonly initialCodeGenState = {
    variables: [],
    notes: {},
  };

  private readonly _boardConfig$ = new BehaviorSubject<BoardConfig>(this.initialState);

  private readonly codeGen$ = new BehaviorSubject<GeneratedData>(this.initialCodeGenState);

  private readonly resetBehaviour$ = new Subject<void>();

  private currentKey = '';

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly localStorageService: LocalStorageService,
    private readonly location: Location,
    private readonly serverSyncService: ServerSyncService,
  ) {
    this.init();
    this.serverSyncService.init((config) => {
      this._boardConfig$.next({...config, lastSyncTime: Date.now()});
      this.updateRoute();
    });
  }

  public code(): Observable<string|undefined> {
    return this.codeGen$.asObservable().pipe(
      map(data => data.code),
    )
  }

  public variables(): Observable<Action[]> {
    return this.codeGen$.asObservable().pipe(map(data => data.variables));
  }

  public variablesSnapshot(): Action[] {
    return this.codeGen$.value.variables;
  }

  public associations(): Observable<Action[]> {
    return this.boardConfig$.pipe(
      map(config => config.associations.map((a, index) => a.actions.map(act => ({...act, uuid: a.uuid, index }))).flat()
      .map(({ title, index, ...other } ) => ({...other, title: `${title} ${index + 2}`}))),
    );
  }
  public get snapshot(): BoardConfig {
    return this._boardConfig$.value;
  }

  public get boardConfig$(): Observable<BoardConfig> {
    return this._boardConfig$.asObservable();
  }

  public rules(): Observable<Rule[] | null> {
    return this._boardConfig$.pipe(map(state => state.rules));
  }

  public patchRules(rules: Rule[]): void {
    const snapshot = this.snapshot;
    this._boardConfig$.next({...snapshot, rules, lastChangedTime: Date.now()});
    this.updateRoute();
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

    this._boardConfig$.next({...state, pins: updated, lastChangedTime: Date.now() });

    console.group('Store');
    console.log(this.snapshot);
    console.groupEnd();

    this.updateRoute();
  }

  public resetBehaviour(): Observable<void> {
    return this.resetBehaviour$.asObservable();
  }

  public reset(): void {
    this._boardConfig$.next({ ...this.initialState, lastChangedTime: Date.now()});
    this.localStorageService.set(this.currentKey, {
      pins: [],
      associations: [],
    });
    this.codeGen$.next(this.initialCodeGenState);
    this.router.navigate([]);
    this.resetBehaviour$.next();
  }

  private updateRoute(): void {
    const config = this.snapshot;
    // const configBase64 = compressToEncodedURIComponent(JSON.stringify(config, (key, value) => value === null || value === undefined ? undefined : value));
    this.localStorageService.set(this.currentKey, config);

    const query = this.router.createUrlTree([], {relativeTo: this.activatedRoute, queryParams: {url: config.remoteUrl}}).toString();

    console.warn(config.remoteUrl);

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

    this._boardConfig$.next({ ...state, pins: value, lastChangedTime: Date.now() });
    this.updateRoute();
  }

  public updateAssociations(associations: Association[]): void {
    const state = this.snapshot;

    if (!(state.associations.length === 0 && associations.length === 0)) {
      this._boardConfig$.next({ ...state, associations, lastChangedTime: Date.now() });
      this.updateRoute();
    }
  }

  private init(): void {
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
