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
  parameters: (ActionParameter | number | string)[];
}

export interface Association {
  initName: string;
  title: string;
  actions: Action[];
  uuid?: string;
}

