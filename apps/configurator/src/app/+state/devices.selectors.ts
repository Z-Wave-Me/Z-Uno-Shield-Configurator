import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  DEVICES_FEATURE_KEY,
  DevicesState,
  devicesAdapter,
} from './devices.reducer';

// Lookup the 'Devices' feature state managed by NgRx
export const selectDevicesState =
  createFeatureSelector<DevicesState>(DEVICES_FEATURE_KEY);

const { selectAll, selectEntities } = devicesAdapter.getSelectors();

export const selectDevicesLoaded = createSelector(
  selectDevicesState,
  (state: DevicesState) => state.loaded
);

export const selectDevicesError = createSelector(
  selectDevicesState,
  (state: DevicesState) => state.error
);

export const selectAllDevices = createSelector(
  selectDevicesState,
  (state: DevicesState) => selectAll(state)
);

export const selectDevicesEntities = createSelector(
  selectDevicesState,
  (state: DevicesState) => selectEntities(state)
);

export const selectSelectedId = createSelector(
  selectDevicesState,
  (state: DevicesState) => state.selectedId
);

export const selectEntity = createSelector(
  selectDevicesEntities,
  selectSelectedId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : undefined)
);
