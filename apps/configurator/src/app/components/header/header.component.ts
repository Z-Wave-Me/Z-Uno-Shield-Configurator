import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { NotificationService } from '../../services/notification/notification.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PinsStateService } from '../../services/store/pins-state.service';
import { ClipboardModule } from '@angular/cdk/clipboard';

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
  ],
})
export class HeaderComponent {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly pinsStateService: PinsStateService,
  ) {}

  public reset(): void {
    this.pinsStateService.reset();
    this.notificationService.show($localize`refreshed`);
  }

  public get url(): string {
    return window.location.href;
  }
}
