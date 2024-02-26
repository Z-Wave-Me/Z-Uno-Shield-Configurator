import { Component } from '@angular/core';
import { ZUnoCompilerClass } from '../../ZUnoCompiler/src/z-uno-compiler';

@Component({
  selector: 'select_freq_component',
  templateUrl: './select_freq.component.html',
  styleUrls: ['./select_freq.component.scss'],
})
export class SelectFreq {
    public selected_freq: string = "Keep current frequency";

  constructor(
  ) {
  }
  public getFreqList(): Array<string> {
    return (ZUnoCompilerClass.getFreqList());
  }

}