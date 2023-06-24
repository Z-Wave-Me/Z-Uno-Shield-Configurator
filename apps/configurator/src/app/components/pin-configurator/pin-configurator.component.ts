import {ChangeDetectionStrategy, Component, HostBinding, Input} from '@angular/core';
import {ChildPinConfigurator, PinConfigurator} from "../../shared/pin-configurator.interface";

interface Pin {
  title: string;
  pin: {
    withGround?: number; key: string; title: string; options: PinConfigurator[];
  }[]
}

@Component({
  selector: 'configurator-pin-configurator',
  templateUrl: './pin-configurator.component.html',
  styleUrls: ['./pin-configurator.component.scss'],
  host: {'class': 'mat-elevation-z8'},
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PinConfiguratorComponent {
  private _options!: Pin
  @Input() set options(options: Pin) {
    console.log(options);
    console.log(options);
    const pin = options.pin.map((p) => {
      if (p.withGround) {
        const replacedOptions = p.options.map(el => {
          return {
            ...el, additionally: [{
              title: `${p.withGround} ` + $localize`V or ground`, value: p.withGround + 'V or ground'
            }, {
              title: $localize`Free or ground`, value: 'Free or ground'
            }]
          }
        });
        return {...p, options: replacedOptions};
      }
      return p;
    });

    this._options = {...options, pin}

  }

  get options() {
    return this._options;
  }

  selected?: {
    withGround?: number; key: string; title: string; options: PinConfigurator[];
  };

  test(event: ChildPinConfigurator) {
    console.log(event);
  }
}
