import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { NotificationService } from '../../services/notification/notification.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PinsStateService } from '../../services/store/pins-state.service';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { RouterLink } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { SidenavService } from '../../services/nav-service/sidenav.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'configurator-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatTabsModule,
    MatButtonModule,
    MatTooltipModule,
    ClipboardModule,
    RouterLink,
    MatSidenavModule,
    MatFormFieldModule,
    MatSelectModule,
    AsyncPipe,
  ],
})
export class HeaderComponent {
  public readonly title$: Observable<string>;

  constructor(
    private readonly notificationService: NotificationService,
    private readonly pinsStateService: PinsStateService,
    private readonly sidenavService: SidenavService,
  ) {
    this.title$ = this.sidenavService.title();
  }

  public reset(): void {
    this.pinsStateService.reset();
    this.notificationService.show($localize`refreshed`);
  }

  public get url(): string {
    return window.location.href;
  }

  public openSidenav(): void {
    this.sidenavService.open();
  }
}
