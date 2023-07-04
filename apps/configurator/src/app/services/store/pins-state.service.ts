import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, Observable, take } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

export enum ConnectionMode {
  Normal = 'normal',
  Inverted = 'inverted',
}

export type DeviceConfig = {
  title: string;
  id: string | number;
  additionally: string | number | null | undefined;
  type: ConnectionMode | null,
  withGround?: number;
  lowerBound: number | null;
  upperBound: number | null;
}

export type PinConfig = {
  id: string;
  device?: Partial<DeviceConfig>;
  key?: string;
  lockIds?: string[];
}



@Injectable({
  providedIn: 'root',
})
export class PinsStateService {
  private readonly _state$ = new BehaviorSubject<PinConfig[]>([]);
  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
  ) {
    this.activatedRoute.queryParams.pipe(
      take(1),
      filter(data => data['config']),
      map(data => data['config']),
    ).subscribe((config) => {
      const data = JSON.parse(atob(decodeURIComponent(config)));
      this._state$.next(data);
    })
  }

  public patch(pin: PinConfig): void {
    const value = this._state$.value;
    const updated = value.filter(({id}) => id !== pin.id);

    if (pin.device) {
      updated.push(pin);
    }

    this._state$.next(updated);
    console.group('Store');
    console.log(this.snapshot);
    console.groupEnd();
    this.updateRoute();
  }

  public reset(): void{
    this._state$.next([]);
    this.router.navigate([]);
  }

  public get snapshot(): PinConfig[] {
    return this._state$.value;
  }

  public get state$(): Observable<PinConfig[]> {
    return this._state$.asObservable();
  }

  private updateRoute(): void {
    const config = this.snapshot;
    const configBase64 = btoa(JSON.stringify(config));
    this.router.navigate([], {
      queryParams: { config: configBase64 },
      queryParamsHandling: 'merge',
    });
  }
}
