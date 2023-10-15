import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { PinConfiguratorInput } from '../../../shared/pin-configurator.interface';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ConnectionMode, DeviceConfig } from '../../../services/store/pins-state.service';

interface DeviceForm {
  list: FormControl<PinConfiguratorInput | null>;
  additionally: FormControl<string | number | null>;
  type: FormControl<ConnectionMode | null>;
  lowerBound: FormControl<number | null>;
  upperBound: FormControl<number | null>;
}

@Component({
  selector: 'configurator-child-pin-configurator[optionsList]',
  templateUrl: './child-device-configurator.component.html',
  styleUrls: ['./child-device-configurator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChildDeviceConfiguratorComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  protected readonly connectionMode = ConnectionMode;

  @Input()
  public optionsList!: {
    withGround?: number;
    key: string;
    title: string;
    options: PinConfiguratorInput[];
    map?: number;
  };

  @Input()
  public init?: Partial<DeviceConfig>;

  @Output()
  public changePin = new EventEmitter<Partial<DeviceConfig>>();

  public deviceForm: FormGroup<DeviceForm>;

  constructor(
    private readonly formBuilder: FormBuilder,
    ) {
    this.deviceForm = this.formBuilder.nonNullable.group<DeviceForm>({
      list: new FormControl<PinConfiguratorInput | null>(null),
      type: new FormControl<ConnectionMode | null>(null),
      additionally: new FormControl<string | null>(null),
      lowerBound: new FormControl<number | null>(null),
      upperBound: new FormControl<number | null>(null),
    });
  }

  public ngOnInit(): void {
    this.InitForm();

    this.deviceForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((config) => {
        const { list, ...other } = config;
        this.changePin.emit({ ...other, title: list?.title, id: list?.value, deviceType: list?.type });
      });

    if (!this.init) {
      this.deviceForm.updateValueAndValidity();
    }
  }

  private InitForm(): void {
    this.deviceForm.controls.list.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if (data?.withType) {
          this.deviceForm.controls.type.patchValue(
            this.init?.type ?? ConnectionMode.Normal, {
            emitEvent: false,
          });
        } else {
          this.deviceForm.controls.type.reset(undefined, { emitEvent: false });
        }

        if (data?.additionally) {
          this.deviceForm.controls.additionally.patchValue(
            this.init?.additionally ?? data.additionally[0].value, { emitEvent: false });
        } else {
          this.deviceForm.controls.additionally.reset(undefined, {
            emitEvent: false,
          });
        }

        if (this.optionsList.map) {
          this.deviceForm.controls.lowerBound.patchValue(this.init?.lowerBound ?? 0, { emitEvent: false });
          this.deviceForm.controls.upperBound.patchValue(this.init?.upperBound ?? 99, { emitEvent: false });
        }

      });

    const initList = this.optionsList.options.find(({ value}) => value === this.init?.id)
    this.deviceForm.controls.list.patchValue(initList ?? this.optionsList.options[0]);
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
