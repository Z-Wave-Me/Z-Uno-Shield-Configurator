import { Component, OnDestroy, OnInit } from '@angular/core';
import { PinsStateService } from '../../../services/store/pins-state.service';
import { filter, first, Subject, takeUntil } from 'rxjs';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Action, Expression, LinearValues, Logical } from '@configurator/shared';
import { Rule } from 'eslint';
import { notNull } from '@configurator/arduino-code-gen';

@Component({
  selector: 'configurator-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss'],
})
export class RulesComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject<void>();
  public readonly form: FormGroup<RulesForm> = new FormGroup<RulesForm>({
    rules: new FormArray<FormGroup<RuleForm>>([]),
  })

  constructor(
    private readonly pinsStateService: PinsStateService,
  ) {

    this.form.valueChanges.pipe(
      takeUntil(this.destroy$),
    ).subscribe((data) => {
      if (data.rules) {
        this.pinsStateService.patchRules(data.rules as Rule[]);
      }
    })
  }

  public ngOnInit(): void {
    this.pinsStateService.rules().pipe(
      filter(notNull),
      first(),
    ).subscribe(rules => {
      rules.map(r => this.addRule(r));
    });

    this.pinsStateService.resetBehaviour().pipe(
      takeUntil(this.destroy$),
    ).subscribe(() => {
     this.form.controls.rules.clear();
    })
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  public addRule({expressions, elseBlock, actions}: Rule = {expressions: [{
      expression: [null, '', null],
    }], elseBlock: [], actions: []}): void {
    const control = new FormGroup<RuleForm>({
      expressions: new FormArray<FormControl<Expression>>([]),
      actions: new FormArray<FormControl<Action>>([]),
      elseBlock: new FormArray<FormControl<Action>>([]),
    });

    (expressions ?? []).forEach(e => control.controls.expressions.push(new FormControl<Expression>(e, { nonNullable: true})));
    (actions ?? []).forEach(a => control.controls.actions.push(new FormControl<Action>(a, { nonNullable: true })));
    (elseBlock ?? []).forEach(a => control.controls.elseBlock.push(new FormControl<Action>(a, { nonNullable: true })));

    this.form.controls.rules.push(control);
  }

  public removeRule(index: number): void {
    this.form.controls.rules.removeAt(index);
  }

  public addAction(actions: FormArray): void {
    actions.push(new FormControl(null))
  }

  public removeAction(actions: FormArray, index: number): void {
    actions.removeAt(index);
  }

  public addExpression(expression: FormArray) {
    expression.push(new FormControl<Expression>({
      expression: [null, '', null]
    }));
  }

  public removeExpression(expression: FormArray, expressionIndex: number) {
    expression.removeAt(expressionIndex);
  }
}

export interface RuleForm {
  expressions: FormArray<FormControl<Expression>>;
  actions:  FormArray<FormControl<Action>>;
  elseBlock:  FormArray<FormControl<Action>>;
}

export interface RulesForm {
  rules: FormArray<FormGroup<RuleForm>>;
}

export interface ActionForm {
  action: FormControl<Action | undefined>;
  parameters: FormControl<Action | undefined>;
}

export interface ExpressionForm {
  left: FormControl<LinearValues<Action> | null>;
  operand: FormControl<string>;
  right: FormControl<LinearValues<Action> | null>;
  operator: FormControl<Logical | undefined>;
}

export interface Rule {
  expressions: Expression[];
  actions: Action[];
  elseBlock: Action[];
}
