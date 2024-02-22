import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Action, Expression, LinearValues, Logical, OperatorType } from '@configurator/shared';
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
      left: new FormControl<LinearValues<Action> | null>(null, {
        validators: [Validators.required],
      }),
      operand: new FormControl<string>('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      right: new FormControl<LinearValues<Action> | null>(null, {
        validators: [Validators.required],
      }),
      operator: new FormControl<Logical| undefined>(undefined, {nonNullable: true}),
    });

  public readonly operatorList = [
    {
      label: 'AND',
      value: Logical.and,
    },
    {
      label: 'OR',
      value: Logical.or,
    }
  ];

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
      label: '≠'
      value: '!=',
    },
    {
      label: 'changedBy',
      value: OperatorType.changeBy,
      unary: true,
    },
  ];
  public readonly variableList$: Observable<Action[]>;
  public expression: Expression | undefined;
  public disabled = false;


  @Input()
  first: boolean = false;

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
        this.onChange({
          expression: [this.makeAction(data.left), data.operand!, this.makeAction(data.right)],
          operator: data.operator,
        });
      });
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
    if (expression.expression[0] && expression.expression[2]) {
      this.expressionForm.controls.left.setValue(expression.expression[0]);
      this.expressionForm.controls.operand.setValue(expression.expression[1]);
      this.expressionForm.controls.right.setValue(expression.expression[2]);
      this.expressionForm.controls.operator.setValue(expression.operator);
    }
  }

  private makeAction(value: LinearValues<Action> | null | undefined): LinearValues<Action> | null {
    const zero: Action | string | number | undefined | null = value?.[0];
    if (typeof zero === 'string' || typeof zero === 'number') {
      return [{
        parentId: `${zero}`,
        title: `${zero}`,
        parameters: [zero],
        template: '{0}'
        // @ts-ignore
      }, value[1], value[2]]
    }

    return value ?? null;
  }
}

interface Option {
  value: string | OperatorType.changeBy;
  label: string;
  unary?: boolean;
}
