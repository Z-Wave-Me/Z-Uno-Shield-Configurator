import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PinSelectedService {
  private readonly store$ = new ReplaySubject<PinContainer>(1);

  public select(item: PinContainer): void {
    this.store$.next(item);
  }

  public get selectObserver(): Observable<PinContainer> {
    return this.store$.asObservable();
  }
}

export interface PinContainer {
  id: string;
}
