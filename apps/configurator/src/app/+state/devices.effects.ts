import { Injectable, inject } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { switchMap, catchError, of } from 'rxjs';
import * as DevicesActions from './devices.actions';
import * as DevicesFeature from './devices.reducer';

@Injectable()
export class DevicesEffects {
  private actions$ = inject(Actions);

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DevicesActions.initDevices),
      switchMap(() => of(DevicesActions.loadDevicesSuccess({ devices: [] }))),
      catchError((error) => {
        console.error('Error', error);
        return of(DevicesActions.loadDevicesFailure({ error }));
      })
    )
  );
}
