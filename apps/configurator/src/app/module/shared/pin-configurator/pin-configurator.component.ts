import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import {
  PinsStateService,
} from '../../../services/store/pins-state.service';
import { DeviceConfig, PinConfig, PinConfiguratorInput } from '@configurator/shared';
import { Grounding, VoltageOffset } from '@configurator/arduino-code-gen';

interface Pin {
  id: string;
  title: string;
  pin: {
    withGround?: number;
    key: string;
    title: string;
    options: PinConfiguratorInput[];
  }[];
}

@Component({
  selector: 'configurator-pin-configurator',
  templateUrl: './pin-configurator.component.html',
  styleUrls: ['./pin-configurator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PinConfiguratorComponent implements OnInit, OnDestroy {
  private readonly destroyed$ = new Subject<void>();
  private _options!: Pin;

  @HostBinding('class.mat-elevation-z8')
  private shadow = true;

  public init?: Partial<DeviceConfig>;

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
                value: p.withGround ?? -1,
              },
              {
                title: $localize`Free or ground`,
                value: Grounding.Free,
              },
            ],
          };
        });

        return { ...p, options: replacedOptions };
      }

      return p;
    });

    this._options = { ...options, pin };
    this.setDevice(this.pinsStateService.snapshot);
  }

  public get options(): Pin {
    return this._options;
  }

  public selected?: {
    withGround?: number;
    key: string;
    title: string;
    options: PinConfiguratorInput[];
    offset?: VoltageOffset;
  };

  constructor(
    private readonly pinsStateService: PinsStateService,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    this.pinsStateService.state$.pipe(takeUntil(this.destroyed$)).subscribe(
      state => {
        this.setDevice(state);
      },
    );
  }

  public ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  public changePin(config: Partial<DeviceConfig>): void {
    this.pinsStateService.patch({
      id: this.options.id,
      key: this.selected?.key,
      device: config,
      offset: this.selected?.offset,
      lockIds: [],
    });
  }

  public remove(): void {
    this.selected = undefined;
    this.pinsStateService.patch({
      id: this.options.id,
      device: {... this.pinsStateService.snapshot.find(
          ({ id }) => id === this.options.id,
        )?.device ?? {}, remove: true},
      lockIds: [],
    });
  }

  private setDevice(config:  PinConfig[]): void {
    const stored = config.find(
      ({ id }) => id === this.options.id,
    );
    this.selected = this.options.pin.find(({ key }) => stored?.key === key);
    this.init = stored?.device;
    this.changeDetectorRef.detectChanges();
  }
}
