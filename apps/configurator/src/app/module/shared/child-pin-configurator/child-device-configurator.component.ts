import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ConnectionMode, DeviceConfig, PinConfiguratorInput } from '@configurator/shared';
import { VoltageOffset } from '@configurator/arduino-code-gen';

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
export class ChildDeviceConfiguratorComponent
  implements OnChanges, OnInit, OnDestroy {
  @Input() public optionsList!: {
    withGround?: number;
    key: string;
    title: string;
    options: PinConfiguratorInput[];
    offset?: VoltageOffset;
  };
  @Input() public init?: Partial<DeviceConfig>;
  @Output() public changePin = new EventEmitter<Partial<DeviceConfig>>();
  public deviceForm: FormGroup<DeviceForm>;
  protected readonly connectionMode = ConnectionMode;
  private destroy$ = new Subject<void>();

  constructor(private readonly formBuilder: FormBuilder) {
    this.deviceForm = this.formBuilder.nonNullable.group<DeviceForm>({
      list: new FormControl<PinConfiguratorInput | null>(null),
      type: new FormControl<ConnectionMode | null>(null),
      additionally: new FormControl<string | null>(null),
      lowerBound: new FormControl<number | null>(null),
      upperBound: new FormControl<number | null>(null),
    });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['init'] && changes['init'].currentValue?.id) {
      this.deviceForm.controls.list.patchValue(
        this.optionsList.options.find(
          (item) => item.value === changes['init'].currentValue.id,
        ) ?? null,
        { emitEvent: false },
      );
    }
  }

  public ngOnInit(): void {
    this.InitForm();

    this.deviceForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((config) => {
        const { list, ...other } = config;
        this.changePin.emit({
          ...other,
          title: list?.title,
          id: list?.value,
          deviceType: list?.type,
          bindPin: list?.bindPin,
        });
      });

    if (!this.init) {
      this.deviceForm.updateValueAndValidity();
    }
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private InitForm(): void {
    this.deviceForm.controls.list.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.updateForm(data);
      });

    const initList = this.optionsList.options.find(
      ({ value }) => value === this.init?.id,
    );
    this.deviceForm.controls.list.patchValue(
      initList ?? this.optionsList.options[0],
    );
  }

  private updateForm(data: PinConfiguratorInput | null): void {
    if (data?.withType) {
      this.deviceForm.controls.type.patchValue(
        this.init?.type ?? ConnectionMode.Normal,
        {
          emitEvent: false,
        },
      );
    } else {
      this.deviceForm.controls.type.reset(undefined, { emitEvent: false });
    }

    if (data?.additionally) {
      this.deviceForm.controls.additionally.patchValue(
        this.init?.additionally ?? data.additionally[0].value,
        { emitEvent: false },
      );
    } else {
      this.deviceForm.controls.additionally.reset(undefined, {
        emitEvent: false,
      });
    }

    if (this.optionsList.offset) {
      this.deviceForm.controls.lowerBound.patchValue(
        this.init?.lowerBound ?? 0,
        { emitEvent: false },
      );
      this.deviceForm.controls.upperBound.patchValue(
        this.init?.upperBound ?? 99,
        { emitEvent: false },
      );
    }
  }
}
