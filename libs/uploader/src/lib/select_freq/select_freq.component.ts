import { Component } from '@angular/core';
import { ZUnoCompilerClass } from '../../ZUnoCompiler/src/z-uno-compiler';

@Component({
  selector: 'select_freq_component',
  templateUrl: './select_freq.component.html',
  styleUrls: ['./select_freq.component.scss'],
})
export class SelectFreq {
    public selected_freq: string = "None";


teams: any[] = [
    { name: 'Liverpool' },
    { name: 'Manchester City' },
    { name: 'Manchester United' },
    { name: 'Arsenal' },
    { name: 'Leicester City' },
    { name: 'Chelsea' },
    { name: 'Tottenham Hotspur' },
];
  constructor(
  ) {
  }
  public getFreqList(): Array<string> {
    return (ZUnoCompilerClass.getFreqList());
  }

}