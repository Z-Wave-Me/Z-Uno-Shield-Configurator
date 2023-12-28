import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Action, Expression } from '@configurator/shared';
import { distinctUntilChanged, filter, map, Observable, of, Subject, takeUntil } from 'rxjs';
import { ExpressionForm } from '../rules.component';
import { PinsStateService } from '../../../../services/store/pins-state.service';

@Component({
  selector: 'configurator-expression',
  templateUrl: './expression.component.html',
  styleUrls: ['./expression.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: ExpressionComponent,
    },
  ],
})
export class ExpressionComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject<void>();

  public readonly expressionForm: FormGroup<ExpressionForm>
    = new FormGroup<ExpressionForm>({
      left: new FormControl<string | null>(null),
      operand: new FormControl<string>('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      right: new FormControl<string>('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
    });

  public readonly operandList: { value: string; unary?: boolean }[] = [
    {
      value: '<',
    },
    {
      value: '<',
    },
    {
      value: '≥',
    },
    {
      value: '≤',
    },
    {
      value: '=',
    },
    {
      value: '≠',
    },
    {
      value: 'changedBy',
      unary: true,
    },
  ];
  public readonly variableList$: Observable<Action[]>;
  public expression: Expression | undefined;
  public disabled = false;

  public onChange = (expression: Expression): void => void 0;

  public onTouched = (): void => void 0;

  constructor(
    private readonly pinsStateService: PinsStateService,
  ) {
    this.variableList$ = this.pinsStateService.variables();

   
  }

  public ngOnInit(): void {
    this.expressionForm.valueChanges
      .pipe(
        // filter(() => this.expressionForm.valid),
        takeUntil(this.destroy$),
      )
      .subscribe((data) => {
        if (data.right && data.operand) {
          this.onChange([data.left, data.operand, data.right]);
        }
      });

    this.watchUnary();
  }
  
  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public registerOnChange(onChange: (expression: Expression) => void): void {
    this.onChange = onChange;
  }

  public registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
  }

  public setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  public writeValue(expression: Expression): void {
    this.expression = expression;
  }

  private watchUnary(): void {
    const unary = this.operandList
      .filter(({ unary }) => unary)
      .map(({ value }) => value);

    this.expressionForm.controls.operand.valueChanges
      .pipe(
        map((value) => unary.includes(value)),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
      )
      .subscribe((disable) => {
        const control = this.expressionForm.controls.left;

        if (disable) {
          control.setValue(null);
          control.disable();
        } else {
          control.enable();
        }

        this.expressionForm.updateValueAndValidity();
      });
  }
}
