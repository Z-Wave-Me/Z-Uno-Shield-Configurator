import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { RuleAction } from '@configurator/shared';
import { Observable, of, Subject, takeUntil } from 'rxjs';
import { ActionForm } from '../rules.component';

@Component({
  selector: 'configurator-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: ActionComponent,
    },
  ],
})
export class ActionComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject<void>();

  public readonly actionForm: FormGroup<ActionForm> = new FormGroup<ActionForm>({
    action: new FormControl<string>('', { validators: [Validators.required], nonNullable: true}),
    parameters: new FormControl<number>(0, { validators: [Validators.required], nonNullable: true}),
  })

  public readonly variableList$: Observable<string[]>;

  public action: RuleAction | undefined;
  public disabled = false;

  public onChange = (action: RuleAction): void => void 0;

  public onTouched = (): void => void 0;

  constructor() {
    this.variableList$ = of(['pwn1', 'pwm2', 'accociation2', 'asoc2']);
  }

  public ngOnInit(): void {
    this.actionForm.valueChanges.pipe(
      takeUntil(this.destroy$),
    ).subscribe(data => {
      if (data.action && !isNaN(Number(data.parameters))) {
        this.onChange({
          action: data.action,
          parameters: data.parameters as number,
        })
      }
    })
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public registerOnChange(onChange: (action: RuleAction) => void): void {
    this.onChange = onChange;
  }

  public registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
  }
  public setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  public writeValue(action: RuleAction): void {
    this.action = action;
  }

}
