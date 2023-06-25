import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { PinConfiguratorInput } from '../../shared/pin-configurator.interface';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { auditTime, Subject, takeUntil } from 'rxjs';
import { ConnectionMode, DeviceConfig } from '../../services/store/pin-state.service';

interface DeviceForm {
  list: FormControl<PinConfiguratorInput | null>;
  additionally: FormControl<string | number | null>;
  type: FormControl<ConnectionMode | null>;
  lowerBound: FormControl<number>;
  upperBound: FormControl<number>;
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
  };

  @Input()
  public withType = false;

  @Input()
  public withGround?: number;

  @Output()
  public changePin = new EventEmitter<DeviceConfig>();

  public deviceForm: FormGroup<DeviceForm>;

  constructor(private readonly formBuilder: FormBuilder) {
    this.deviceForm = this.formBuilder.nonNullable.group<DeviceForm>({
      list: new FormControl<PinConfiguratorInput | null>(null),
      type: new FormControl<ConnectionMode | null>(null),
      additionally: new FormControl<string | null>(null),
      lowerBound: new FormControl<number>(0, { nonNullable: true }),
      upperBound: new FormControl<number>(99, { nonNullable: true }),
    });
  }

  public ngOnInit(): void {
    this.deviceForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((config) => {
        const { list, ...other } = config;
        this.changePin.emit({ ...other, title: list?.title, id: list?.value });
      });

    this.InitForm();
  }

  private InitForm(): void {
    this.deviceForm.controls.list.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if (data?.withType) {
          this.deviceForm.controls.type.patchValue(ConnectionMode.Normal, {
            emitEvent: false,
          });
        } else {
          this.deviceForm.controls.type.reset(undefined, { emitEvent: false });
        }

        if (data?.additionally) {
          this.deviceForm.controls.additionally.patchValue(
            data.additionally[0].value, { emitEvent: false });
        } else {
          this.deviceForm.controls.additionally.reset(undefined, {
            emitEvent: false,
          });
        }
      });

    this.deviceForm.controls.list.patchValue(this.optionsList.options[0]);
  }

  public ngOnDestroy(): void {
    this.changePin.emit();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
