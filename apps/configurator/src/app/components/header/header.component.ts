import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatTabsModule} from "@angular/material/tabs";
import {MatButtonModule} from "@angular/material/button";
import {NotificationService} from "../../services/notification/notification.service";
import {MatTooltipModule} from "@angular/material/tooltip";

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
    MatTooltipModule
  ]
})
export class HeaderComponent {
  constructor(private readonly notificationService: NotificationService) {
  }

  reset() {
    this.notificationService.show($localize `refreshed`);
  }
}
