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
import { combineLatest, map, Observable } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';
import { rules } from '@typescript-eslint/eslint-plugin';


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
  public code$: Observable<string| undefined>;

  constructor(private readonly pinsStateService: PinsStateService) {
    this.code$ = combineLatest([this.pinsStateService.code(), this.pinsStateService.rules()]).pipe(
      map(([code, rules]) => {
        return (code ?? '').replace('#rulesBlock', this.rulesToCode(rules));
      }),
    );
  }
  public prevent(event: Event): void {
    event.stopPropagation();
  }

  private rulesToCode(rules: any): string {
    return JSON.stringify(rules, null, 2);
  }
}
