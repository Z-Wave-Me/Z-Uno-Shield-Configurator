import { ChangeDetectionStrategy, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Subject } from 'rxjs';
import { SidenavService } from '../../services/nav-service/sidenav.service';

@Component({
  selector: 'configurator-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent implements OnDestroy {
  private readonly destroy$ : Subject<void> = new Subject<void>();

  @ViewChild('drawer', { static: true })
  private readonly drawer!: MatSidenav;

  constructor(private readonly sidenavService: SidenavService) {
    this.sidenavService.isOpen().subscribe((state) => state ? this.drawer.open() : this.drawer.close())
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
