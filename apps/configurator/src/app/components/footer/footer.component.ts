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
import { Action, Association, Rule } from '@configurator/shared';
import { UploaderModule } from '@configurator/uploader';


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
    UploaderModule,
  ],
})
export class FooterComponent {
  public panelOpenState = false;
  public code$: Observable<string| undefined>;

  constructor(private readonly pinsStateService: PinsStateService) {
    this.code$ = combineLatest([this.pinsStateService.code(), this.pinsStateService.boardConfig$]).pipe(
      map(([code, { rules, associations }]) => {
        return (code ?? '').replace('#rulesBlock', this.rulesToCode(rules ?? [], associations));
      }),
    );
  }
  public prevent(event: Event): void {
    event.stopPropagation();
  }

  private rulesToCode(rules: Rule[], associations: Association[]): string {
    console.log('==============================');
    return rules.map(r => {
      console.log(r, associations);

      return r;
    }).map(r => this.makeRule(r)).join('\n');
  }

  private makeRule(rule: Rule): string {
    let elseBlock = '';

    if (rule.elseBlock.filter(Boolean).length) {
      elseBlock = `
  } else {
${
      // @ts-ignore
    rule.elseBlock.filter(Boolean).map(a => `    ${a.template.replace('{0}', a.parameters[0])}`).join('\n')}`
  }

    if(rule.expression && rule.actions.filter(Boolean).length) {
      return `
  if (${// @ts-ignore
      rule.expression[0]?.['parentId'] ?? rule.expression[0]} ${rule.expression[1]} ${rule.expression[2]?.['parentId'] ?? rule.expression[2]}) {
${// @ts-ignore
      rule.actions.filter(Boolean).map(a => `    ${a.template.replace('{0}', a.parameters[0])}`).join('\n')}${elseBlock}
  }`
        ;
    }

    return '';
  }
}
