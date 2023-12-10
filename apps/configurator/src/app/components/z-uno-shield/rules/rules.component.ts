import { Component, OnDestroy } from '@angular/core';
import { PinsStateService } from '../../../services/store/pins-state.service';
import { Observable, Subject } from 'rxjs';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

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
      expression: new FormControl<ExpressionForm | null >(null),
      actions: new FormArray<FormControl<ActionForm>>([]),
      else: new FormArray<FormControl<ActionForm>>([]),
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
  expression: FormControl<ExpressionForm | null>,
  actions:  FormArray<FormControl<ActionForm>>,
  else:  FormArray<FormControl<ActionForm>>,
}

export interface RulesForm {
  rules: FormArray<FormGroup<RuleForm>>;
}

export interface ActionForm {
  action: FormControl<string>;
  parameters: FormControl<number>;
}

export interface ExpressionForm {
  left: FormControl<string | null>;
  operand: FormControl<string>;
  right: FormControl<string>;
}
