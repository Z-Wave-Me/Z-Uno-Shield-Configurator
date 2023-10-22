import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'configurator-chip-wrapper',
  templateUrl: './zgm230s-wrapper.component.html',
  styleUrls: ['./zgm230s-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Zgm230sWrapperComponent {
  public links: { path: string; title: string }[] = [
    {
      path: '.',
      title: $localize`Select peripherals`,
    },
  ];

  public activeLink = '';
}
