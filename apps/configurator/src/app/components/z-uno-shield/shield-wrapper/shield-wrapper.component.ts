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
    {
      path: 'associations',
      title: $localize`Define associations`,
    },
    {
      path: 'rules',
      title: $localize`Define rules`,
    },
    // {
    //   path: 'instructions',
    //   title: $localize`Build instructions`,
    // },
    // {
    //   path: 'compile',
    //   title: $localize`Compile`,
    // },
  ];

  public activeLink = '';
}
