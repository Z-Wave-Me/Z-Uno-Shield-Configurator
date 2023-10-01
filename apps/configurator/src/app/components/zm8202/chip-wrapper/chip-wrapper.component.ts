import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'configurator-chip-wrapper',
  templateUrl: './chip-wrapper.component.html',
  styleUrls: ['./chip-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipWrapperComponent {
  public links: { path: string; title: string }[] = [
    {
      path: '.',
      title: $localize`Select peripherals`,
    },
  ];

  public activeLink = '';
}
