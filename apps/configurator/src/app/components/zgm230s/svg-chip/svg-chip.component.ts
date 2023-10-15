import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'configurator-svg-chip',
  templateUrl: './svg-chip.component.svg',
  styleUrls: ['./svg-chip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgChipComponent {}
