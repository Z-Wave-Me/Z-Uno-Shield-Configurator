import { Injectable } from '@angular/core';
import {ReplaySubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PinSelectedService {
  private readonly store$ = new ReplaySubject<string>();
  constructor() { }

  select(item: string) {
    this.store$.next(item);
  }

  get selectObserver() {
    return this.store$.asObservable();
  }
}
