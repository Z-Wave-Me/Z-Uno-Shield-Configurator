import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { PinConfiguratorInput } from '../../shared/pin-configurator.interface';
import { DeviceConfig, PinStateService } from '../../services/store/pin-state.service';
import { filter, Subject, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

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
export class PinConfiguratorComponent implements OnInit, OnDestroy {
  private readonly destroyed$ = new Subject<void>();
  private _options!: Pin;

  @HostBinding('class.mat-elevation-z8')
  private shadow = true;

  public init?: DeviceConfig;

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
    this.setDevice();
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
    private readonly activatedRoute: ActivatedRoute,
    private readonly changeDetectorRef: ChangeDetectorRef,
    ) {}

  public ngOnInit(): void {
    this.activatedRoute.queryParams.pipe(
      filter(data => !data['config']),
      takeUntil(this.destroyed$),
    ).subscribe(() => {
      this.setDevice();
    });
  }

  public ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  public changePin(config: DeviceConfig): void {
    this.pinStateService.patch({
      id: this.options.id,
      key: this.selected?.key,
      device: config,
      lockIds: [],
    });
  }

  public remove(): void {
    this.selected = undefined;
    this.pinStateService.patch({
      id: this.options.id,
      lockIds: [],
    });
  }

  private setDevice(): void {
    const stored = this.pinStateService.snapshot.find(
      ({ id }) => id === this.options.id,
    );
    this.selected = this.options.pin.find(({ key }) => stored?.key === key);
    this.init = stored?.device;
    this.changeDetectorRef.detectChanges();
  }
}
