import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: '[chip]',
  templateUrl: './chip.component.svg',
  styleUrls: ['./chip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipComponent {}
