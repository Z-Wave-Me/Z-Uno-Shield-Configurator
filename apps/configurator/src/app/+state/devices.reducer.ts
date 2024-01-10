import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';

import * as DevicesActions from './devices.actions';
import { DevicesEntity } from './devices.models';

export const DEVICES_FEATURE_KEY = 'devices';

export interface DevicesState extends EntityState<DevicesEntity> {
  selectedId?: string | number; // which Devices record has been selected
  loaded: boolean; // has the Devices list been loaded
  error?: string | null; // last known error (if any)
}

export interface DevicesPartialState {
  readonly [DEVICES_FEATURE_KEY]: DevicesState;
}

export const devicesAdapter: EntityAdapter<DevicesEntity> =
  createEntityAdapter<DevicesEntity>();

export const initialDevicesState: DevicesState = devicesAdapter.getInitialState(
  {
    // set initial required properties
    loaded: false,
  }
);

const reducer = createReducer(
  initialDevicesState,
  on(DevicesActions.initDevices, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(DevicesActions.loadDevicesSuccess, (state, { devices }) =>
    devicesAdapter.setAll(devices, { ...state, loaded: true })
  ),
  on(DevicesActions.loadDevicesFailure, (state, { error }) => ({
    ...state,
    error,
  }))
);

export function devicesReducer(
  state: DevicesState | undefined,
  action: Action
) {
  return reducer(state, action);
}
