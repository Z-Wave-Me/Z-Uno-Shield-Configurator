import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { CopyToClipboardDirective } from '../../directives/copy-to-clipboard/copy-to-clipboard.directive';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HighlightModule } from 'ngx-highlightjs';
import { SaveAsFileDirective } from '../../directives/save-as-file/save-as-file.directive';
import { PinsStateService } from '../../services/store/pins-state.service';
import { catchError, map, Observable, of } from 'rxjs';
import { generate } from '@configurator/arduino-code-gen';
import { AsyncPipe, NgIf } from '@angular/common';


@Component({
  selector: 'configurator-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatExpansionModule,
    MatButtonModule,
    ClipboardModule,
    CopyToClipboardDirective,
    MatTooltipModule,
    HighlightModule,
    SaveAsFileDirective,
    NgIf,
    AsyncPipe,
  ],
})
export class FooterComponent {
  public panelOpenState = false;
  public code$: Observable<string>;

  constructor(private readonly pinsStateService: PinsStateService) {
    this.code$ = this.pinsStateService.state$.pipe(
      map(generate),
      catchError(e => of(e.stack)),
    );
  }
  public prevent(event: Event): void {
    event.stopPropagation();
  }
}
