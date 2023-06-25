import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export enum ConnectionMode {
  Normal = 'normal',
  Inverted = 'inverted',
}

export type DeviceConfig = {
  title?: string;
  id?: string | number;
  additionally?: string | number | null | undefined;
  type?: ConnectionMode | null,
  withGround?: number;
  lowerBound?: number;
  upperBound?: number;
}

export type PinConfig = {
  id: string;
  title: string;
  device?: DeviceConfig;
  lockIds?: string[];
}



@Injectable({
  providedIn: 'root',
})
export class PinStateService {
  private readonly _state$ = new BehaviorSubject<PinConfig[]>([]);
  constructor() { }

  public patch(pin: PinConfig): void {
    const value = this._state$.value;
    const updated = value.filter(({id}) => id !== pin.id);

    if (pin.device) {
      updated.push(pin);
    }

    this._state$.next(updated);
    console.warn(this._state$.value);
  }

  public reset(): void{
    this._state$.next([]);
  }

  public get state(): PinConfig[] {
    return this._state$.value;
  }

  public get state$(): Observable<PinConfig[]> {
    return this._state$.asObservable();
  }
}
