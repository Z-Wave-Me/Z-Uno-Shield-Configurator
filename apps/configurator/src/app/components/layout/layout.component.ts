import {Component} from '@angular/core';

@Component({
  selector: 'configurator-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  public links: { path: string, title: string }[] = [{
    path: '', title: $localize `Select peripherals`,
  }, {
    path: 'test', title: $localize `Define relations`,

  }, {
    path: 'test', title: $localize `Connect peripherals`,
  }];

  public activeLink = '';
}
