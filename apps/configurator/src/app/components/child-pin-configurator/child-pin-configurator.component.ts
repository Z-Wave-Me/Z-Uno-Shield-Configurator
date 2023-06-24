import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ChildPinConfigurator, PinConfigurator} from "../../shared/pin-configurator.interface";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {auditTime, startWith, Subject, takeUntil, tap} from "rxjs";

@Component({
  selector: 'configurator-child-pin-configurator[optionsList]',
  templateUrl: './child-pin-configurator.component.html',
  styleUrls: ['./child-pin-configurator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChildPinConfiguratorComponent  implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @Input()
  public optionsList!: {
    withGround?: number; key: string; title: string; options: PinConfigurator[];
  };

  @Input()
  public withType: boolean = false;

  @Input()
  public withGround?: number;

  @Output()
  public changePin = new EventEmitter<ChildPinConfigurator>();

  public form: FormGroup;

  constructor(private readonly formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      list: [undefined, Validators.required],
      type: [],
      additionally: [],
    })
  }

  public ngOnInit(): void {
    this.form.valueChanges.pipe(takeUntil(this.destroy$), auditTime(1)).subscribe(
      data => this.changePin.emit(data)
    )
    this.form.get('list')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((data) => {
        if (data.withType) {
          this.form.get('type')?.setValue('normal');
        } else {
          this.form.get('type')?.setValue(null);
        }

        if (data.additionally) {
          this.form.get('additionally')?.setValue(data.additionally[0].value)
        } else {
          this.form.get('additionally')?.setValue(null);
        }
    })
    this.form.get('list')?.setValue(this.optionsList.options[0]);

  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete()
  }
}
