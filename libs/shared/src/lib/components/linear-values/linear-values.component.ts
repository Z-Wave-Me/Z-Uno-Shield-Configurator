import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { LinearValues } from './linear-values';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'configurator-linear-values',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule, MatOptionModule, MatSelectModule, MatButtonModule, MatIconModule],
  templateUrl: './linear-values.component.html',
  styleUrls: ['./linear-values.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => LinearValuesComponent),
    },
  ],
})
export class LinearValuesComponent implements ControlValueAccessor, OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject<void>();

  @Input()
  label: string = '';

  @Input()
  public mode: 'simple' | 'linear' = 'simple';

  @Input()
  public options: (any[]) | null = [];

  @Input()
  displayWith: ((value: any) => string) | null = null;

  public readonly linearFrom = new FormGroup({
    value: new  FormControl<number>(0),
    alpha: new  FormControl<number>(1),
    betta: new  FormControl<number>(0),
  })
  public onChange(_: (string | number)[]): null {
    return null;
  }

  public onTouched(): void {}


  public ngOnInit(): void {
    this.linearFrom.valueChanges.pipe(
      takeUntil(this.destroy$),
    ).subscribe(data => {
      this.onChange([data.value ?? 0, data.alpha ?? 1, data.betta ?? 0]);
    })
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public writeValue(linearValues: LinearValues): void {
   this.linearFrom.patchValue({
     value: linearValues?.[0] ?? 0,
     alpha: linearValues?.[1] ?? 1,
     betta: linearValues?.[2] ?? 0,
   });

   console.log('=========>', this.linearFrom.controls.alpha.value, this.linearFrom.controls.betta.value)
   if (this.linearFrom.controls.alpha.value !== 1 || this.linearFrom.controls.betta.value !== 0 ) {
     this.mode = 'linear';
   }
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {}

  public modeToggle(event: MouseEvent): void {
    event.stopPropagation();
    if (this.mode === 'linear') {
      this.mode = 'simple'
      this.linearFrom.patchValue({alpha: 1, betta: 0});
    } else  {
      this.mode = 'linear';
    }
  }
}

