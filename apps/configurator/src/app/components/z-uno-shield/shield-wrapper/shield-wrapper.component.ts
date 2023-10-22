import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'configurator-shield-wrapper',
  templateUrl: './shield-wrapper.component.html',
  styleUrls: ['./shield-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShieldWrapperComponent {
  public links: { path: string; title: string }[] = [
    {
      path: '.',
      title: $localize`Select peripherals`,
    },
    // {
    //   path: 'relations',
    //   title: $localize`Define relations`,
    // },
    // {
    //   path: 'test',
    //   title: $localize`Connect peripherals`,
    // },
  ];

  public activeLink = '';
}
