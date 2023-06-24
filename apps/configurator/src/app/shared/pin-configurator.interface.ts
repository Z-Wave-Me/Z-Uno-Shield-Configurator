import {ChildPinConfiguratorComponent} from "../components/child-pin-configurator/child-pin-configurator.component";

export interface PinConfigurator {
  title: string;
  value: string | number;
  withType?: boolean;
  additionally?: {
    title: string;
    value: string | number;
  }[];
}

export interface ChildPinConfigurator {
  list?: string,
  type?: string,
  additionally?: string
}
