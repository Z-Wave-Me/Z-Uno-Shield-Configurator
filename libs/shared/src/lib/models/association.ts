export enum ActionParameterType {
  Byte = 'byte',
  UInt16 = 'uint16_t',
}

export interface ActionParameter {
  name: string;
  type: ActionParameterType;
  userInput: boolean;
}

export interface Action {
  name: string;
  function: string;
  parameters: ActionParameter[];
}

export interface Association {
  initName: string;
  title: string;
  actions: Action[];
}

