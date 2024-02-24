import { LinearValues } from '../components/linear-values/linear-values';

export enum ActionParameterType {
  Byte = 'byte',
  UInt16 = 'uint16_t',
}

export interface ActionParameter {
  title: string;
  type: ActionParameterType;
  userInput: boolean;
}

export interface Action {
  parentId: string;
  title: string;
  template: string;
  parameters: (LinearValues)[];
  isUserInput?: boolean;
}

export interface Association {
  initName: string;
  title: string;
  actions: Action[];
  uuid?: string;
}

export enum OperatorType {
  changeBy = 'changeBy'
}
