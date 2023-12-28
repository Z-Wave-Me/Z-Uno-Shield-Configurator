import { Component, OnDestroy } from '@angular/core';
import { PinsStateService } from '../../../services/store/pins-state.service';
import { Subject, takeUntil } from 'rxjs';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Action, Expression } from '@configurator/shared';
import { rules } from '@typescript-eslint/eslint-plugin';
import { Rule } from 'eslint';

@Component({
  selector: 'configurator-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss'],
})
export class RulesComponent implements OnDestroy {
  private readonly destroy$: Subject<void> = new Subject<void>();
  public readonly form: FormGroup<RulesForm> =  new FormGroup<RulesForm>({
    rules: new FormArray<FormGroup<RuleForm>>([]),
  })
  // public readonly rules$: Observable<Rule[]>;

  constructor(
    private readonly pinsStateService: PinsStateService,
  ) {
    // this.rules$ = this.pinsStateService.rules();
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

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private debug(): void {
    this.form.valueChanges.subscribe(console.log);
  }

  public addRule(): void {
    this.form.controls.rules.push(new FormGroup<RuleForm>({
      expression: new FormControl<Expression | null >(null),
      actions: new FormArray<FormControl<Action>>([]),
      elseBlock: new FormArray<FormControl<Action>>([]),
    }));
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
