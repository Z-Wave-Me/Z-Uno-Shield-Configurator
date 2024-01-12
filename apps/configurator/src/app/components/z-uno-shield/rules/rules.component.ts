import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { PinsStateService } from '../../../services/store/pins-state.service';
import { filter, first, Subject, takeUntil } from 'rxjs';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Action, Expression } from '@configurator/shared';
import { rules } from '@typescript-eslint/eslint-plugin';
import { Rule } from 'eslint';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'configurator-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss'],
})
export class RulesComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject<void>();
  public readonly form: FormGroup<RulesForm> =  new FormGroup<RulesForm>({
    rules: new FormArray<FormGroup<RuleForm>>([]),
  })

  constructor(
    private readonly pinsStateService: PinsStateService,
  ) {

    this.debug();
    this.form.valueChanges.pipe(
      takeUntil(this.destroy$),
    ).subscribe((data) => {
      if (data.rules) {
        // const rules = data.rules
        //   .filter(({expression, actions, elseBlock}) => expression && (actions || elseBlock))
        //   // .map()


        this.pinsStateService.patchRules(data.rules as Rule[]);
      }
    })
  }

  public ngOnInit(): void {
    this.pinsStateService.rules().pipe(
      filter(d => !!d?.length),
      first(),

    ).subscribe(rules => {
      console.warn('=======================================> ', rules);

      rules.map(r => this.addRule(r));
    })
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private debug(): void {
    this.form.valueChanges.subscribe(console.log);
  }

  // @ts-ignore
  public addRule({expression, elseBlock, actions}: Rule = {expression: null, elseBlock: [], actions: []}): void {
    const control = new FormGroup<RuleForm>({
      expression: new FormControl<Expression | null >(expression),
      actions: new FormArray<FormControl<Action>>([]),
      elseBlock: new FormArray<FormControl<Action>>([]),
    });

    // @ts-ignore
    (actions ?? []).forEach(a => control.controls.actions.push(new FormControl<Action>(a)));
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
}

export interface RuleForm {
  expression: FormControl<Expression | null>,
  actions:  FormArray<FormControl<Action>>,
  elseBlock:  FormArray<FormControl<Action>>,
}

export interface RulesForm {
  rules: FormArray<FormGroup<RuleForm>>;
}

export interface ActionForm {
  action: FormControl<Action | undefined>;
  parameters: FormControl<number>;
}

export interface ExpressionForm {
  left: FormControl<string | Action | null>;
  operand: FormControl<string>;
  right: FormControl<string | Action>;
}

export interface Rule {
  expression: Expression,
  actions: Action[],
  elseBlock: Action[],
}
