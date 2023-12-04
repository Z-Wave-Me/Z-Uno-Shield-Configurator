import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { PinsStateService } from '../store/pins-state.service';

@Injectable({
  providedIn: 'root',
})
export class PinSelectedService {
  private readonly store$ = new ReplaySubject<string>(1);

  constructor(
    private readonly pinsStateService: PinsStateService,
  ) {
    const first = pinsStateService.snapshot.pins[0];

    if (first) {
      this.store$.next(first.id);
    }
  }
  public select(item: string): void {
    this.store$.next(item);
  }

  public get selectObserver(): Observable<string> {
    return this.store$.asObservable();
  }
}

export interface PinContainer {
  id: string;
}
