import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Action, Expression } from '@configurator/shared';
import { Observable, Subject, takeUntil } from 'rxjs';
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
      left: new FormControl<string>('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      operand: new FormControl<string>('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      right: new FormControl<string>('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
    });

  public readonly operandList: Option[] = [
    {
      label: '<',
      value: '<',
    },
    {
      label: '>',
      value: '>',
    },
    {
      label: '≥',
      value: '>='
    },
    {
      label: '≤',
      value: '<='
    },
    {
      label: '=',
      value: '=='
    },
    {
      value: '≠',
      label: '!='
    },
    {
      label: 'changedBy',
      value: 'changeFunction',
      unary: true,
    },
  ];
  public readonly variableList$: Observable<Action[]>;
  public expression: Expression | undefined;
  public disabled = false;

  public onChange = (expression: Expression): void => void 0;

  public onTouched = (): void => void 0;

  public getTitle(expression: Action): string {
    return expression?.title;
  }

  constructor(
    private readonly pinsStateService: PinsStateService,
  ) {
    this.variableList$ = this.pinsStateService.variables();
  }

  public ngOnInit(): void {
    this.expressionForm.valueChanges
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe((data) => {
        this.onChange([this.makeAction(data.left), data.operand!, this.makeAction(data.right)]);
      });

    // this.watchUnary();
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

  public compareOperand(option: Option, value: string): boolean {
    return  option.value === value;
  }

  public writeValue(expression: Expression): void {
    if (expression[0] && expression[2]) {
      this.expressionForm.controls.left.setValue(expression[0]);
      this.expressionForm.controls.operand.setValue(expression[1]);
      this.expressionForm.controls.right.setValue(expression[2]);
    }
    this.expression = expression;
  }

  // private watchUnary(): void {
  //   const unary = this.operandList
  //     .filter(({ unary }) => unary)
  //     .map(({ value }) => value);
  //
  //   this.expressionForm.controls.operand.valueChanges
  //     .pipe(
  //       map((value) => unary.includes(value)),
  //       distinctUntilChanged(),
  //       takeUntil(this.destroy$),
  //     )
  //     .subscribe((disable) => {
  //       const control = this.expressionForm.controls.left;
  //
  //       // if (disable) {
  //       //   control.setValue(null);
  //       //   control.disable();
  //       // } else {
  //       //   control.enable();
  //       // }
  //
  //       this.expressionForm.updateValueAndValidity();
  //     });
  // }

  private makeAction(value: Action | string | number | undefined | null): Action | null {
    if (typeof value === 'string' || typeof value === 'number') {
      return {
        parentId: value.toString(),
        title: value.toString(),
        parameters: [value],
        template: '{0}'
      }
    }

    return value ?? null;
  }
}

interface Option {
  value: string;
  label: string;
  unary?: boolean;
}
