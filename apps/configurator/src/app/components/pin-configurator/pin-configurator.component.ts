import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import {ChildPinConfigurator, PinConfiguratorInput} from "../../shared/pin-configurator.interface";
import { DeviceConfig, PinConfig, PinStateService } from '../../services/store/pin-state.service';

interface Pin {
  id: string;
  title: string;
  pin: {
    withGround?: number; key: string; title: string; options: PinConfiguratorInput[];
  }[]
}

@Component({
  selector: 'configurator-pin-configurator',
  templateUrl: './pin-configurator.component.html',
  styleUrls: ['./pin-configurator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PinConfiguratorComponent {
  private _options!: Pin;

  @HostBinding('class.mat-elevation-z8')
  private shadow = true;

  @Input()
  public set options(options: Pin) {
    const pin = options.pin.map((p) => {
      if (p.withGround) {
        const replacedOptions = p.options.map((el) => {
          return {
            ...el,
            additionally: [
              {
                title: `${p.withGround} ` + $localize`V or ground`,
                value: p.withGround + 'V or ground',
              },
              {
                title: $localize`Free or ground`,
                value: 'Free or ground',
              },
            ],
          };
        });

        return { ...p, options: replacedOptions };
      }

      return p;
    });

    this._options = { ...options, pin };
  }

  public get options(): Pin {
    return this._options;
  }

  public selected?: {
    withGround?: number;
    key: string;
    title: string;
    options: PinConfiguratorInput[];
  };

  constructor(
    private readonly pinStateService: PinStateService,
  ) {
  }
  public changePin(config: DeviceConfig): void {
    this.pinStateService.patch({
      id: this.options.id,
      title: this.options.title,
      device: config,
      lockIds: [],
    });
  }
}
