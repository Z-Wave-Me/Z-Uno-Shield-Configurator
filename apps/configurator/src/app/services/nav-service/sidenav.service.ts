import { Injectable } from '@angular/core';
import { ActivationEnd, NavigationEnd, Router } from '@angular/router';
import { Observable, ReplaySubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidenavService {
  private readonly behaviour$: Subject<boolean> = new Subject<boolean>();
  private readonly title$: ReplaySubject<string> = new ReplaySubject<string>(1);
  
  
  constructor(private readonly router: Router) {
    this.router.events
      .subscribe((event) => {
        if (event instanceof ActivationEnd) {
          const title = event.snapshot.data['title'];

          if (title) {
            this.title$.next(title)
          }
        }

        if (event instanceof NavigationEnd) {
          this.close();
        }
      });
  }

  public open(): void {
    this.behaviour$.next(true);
  }

  public close(): void {
    this.behaviour$.next(false)
  }

  public isOpen(): Observable<boolean> {
    return  this.behaviour$.asObservable();
  }

  public title(): Observable<string> {
    return this.title$.asObservable();
  }
}
