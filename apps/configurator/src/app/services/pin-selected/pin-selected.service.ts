import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PinSelectedService {
  private readonly store$ = new ReplaySubject<string>(1);

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
