import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'configurator-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  public links: { path: string, title: string }[] = [{
    path: '', title: $localize `Select peripherals`,
  }, {
    path: 'relations', title: $localize `Define relations`,

  }, {
    path: 'test', title: $localize `Connect peripherals`,
  }];

  public activeLink = '';
}
