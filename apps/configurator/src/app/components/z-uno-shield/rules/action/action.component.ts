import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Action, Association, RuleAction } from '@configurator/shared';
import { combineLatest, map, Observable, of, Subject, takeUntil, withLatestFrom } from 'rxjs';
import { ActionForm } from '../rules.component';
import { PinsStateService } from '../../../../services/store/pins-state.service';

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

  public readonly variableList$: Observable<Action[]>;

  public action: RuleAction | undefined;
  public disabled = false;

  public onChange = (action: RuleAction): void => void 0;

  public onTouched = (): void => void 0;

  constructor(
    private readonly pinsStateService: PinsStateService,
  ) {
    this.variableList$ = combineLatest([this.pinsStateService.variables(), this.pinsStateService.associations()]).pipe(
      map(([variables, associations]) => {
        return [...variables, ...associations]
      }),
    )
  }

  public ngOnInit(): void {
    this.actionForm.valueChanges.pipe(
      withLatestFrom(this.variableList$),
      takeUntil(this.destroy$),
    ).subscribe(([data, list]) => {
      if (data.action && !isNaN(Number(data.parameters))) {
        const code = list.find(item => item.title === data);
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
