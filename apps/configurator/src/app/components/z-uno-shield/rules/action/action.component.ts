import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Action } from '@configurator/shared';
import { combineLatest, map, Observable, Subject, takeUntil } from 'rxjs';
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
    action: new FormControl<Action | undefined>(undefined, { validators: [Validators.required], nonNullable: true }),
    parameters: new FormControl<number>(0, { validators: [Validators.required], nonNullable: true}),
  })

  public readonly variableList$: Observable<Action[]>;

  public action: Action | undefined;
  public disabled = false;

  public onChange = (action: Action): void => void 0;

  public onTouched = (): void => void 0;

  public getTitle(option: Action, value: Action ): boolean {
    return option.parentId === value.parentId;
  }

  constructor(
    private readonly pinsStateService: PinsStateService,
  ) {
    this.variableList$ = combineLatest([this.pinsStateService.variables(), this.pinsStateService.associations()]).pipe(
      map(([variables, associations]) => {
        console.log('=================>', variables, associations);

        return [...variables, ...associations]
      }),
    )
  }

  public ngOnInit(): void {
    this.actionForm.valueChanges.pipe(
      takeUntil(this.destroy$),
    ).subscribe((data) => {
      const {action, parameters} = data;

      if (action && !isNaN(Number(parameters))) {
        this.onChange({ ...action, parameters: [parameters ?? 0] });
      }
    })
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public registerOnChange(onChange: (action: Action) => void): void {
    this.onChange = onChange;
  }

  public registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
  }
  public setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  public writeValue(action: Action): void {
    this.action = action;
  }

}
