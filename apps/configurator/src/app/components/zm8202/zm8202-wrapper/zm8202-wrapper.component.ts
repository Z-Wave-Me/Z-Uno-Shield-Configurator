import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'configurator-zm8202-wrapper',
  templateUrl: './zm8202-wrapper.component.html',
  styleUrls: ['./zm8202-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Zm8202WrapperComponent {
  public links: { path: string; title: string }[] = [
    {
      path: '.',
      title: $localize`Select peripherals`,
    },
  ];

  public activeLink = '';
}
