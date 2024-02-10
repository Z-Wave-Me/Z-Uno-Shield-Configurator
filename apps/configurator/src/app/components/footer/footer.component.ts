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
import { Action, Association, Expression, Logical, OperatorType, Rule } from '@configurator/shared';
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
    return rules.map(r => this.makeRule(r, associations)).join('\n');
  }

  private makeRule(rule: Rule, associations: Association[]): string {
    let elseBlock = '';

    if (rule.elseBlock.filter(Boolean).length) {
      elseBlock = `
  } else {
${
    rule.elseBlock.filter(Boolean).filter(Boolean)
    .map(a => this.makeAction(a, associations))
    .filter(Boolean)
    .join('\n')}`
  }

    if(rule.expression && rule.actions.filter(Boolean).length) {
      return `
  if (${this.makeExpression([rule.expression])}) {
${
      rule.actions
      .filter(Boolean)
      .map(a => this.makeAction(a, associations))
      .filter(Boolean)
      .join('\n')}${elseBlock
  }
  }`
        ;
    }

    return '';
  }

  private makeAction = (action: Action, associations: Association[]): string | null  => {
    const index = associations.findIndex(association => association.uuid === action.parentId);
    const hasAssociation = action.template.includes('{1}')
    // TODO добавить сообщение об ошибке в форме (отсутствует ассоциация)
    if (hasAssociation && index < 0) {
      return null;
    }

    return `    ${
      action.template
      .replace('{1}', (2 + index).toString())
      .replace('{0}', action.parameters[0].toString())}`
  }

  private makeExpression(list: Expression[]): string {
    const expressionToString = ({ expression }: Expression) => {
      if (expression[1] === OperatorType.changeBy) {
        return `changeByFunction(${getName(expression[0])}, ${expression[2]}`
      }

      return `${getName(expression[0])} ${expression[1]} ${getName(expression[2])}`
    }

    const logicalToSting = (operator: Logical | undefined) => {
      switch (operator) {
        case Logical.or:
          return '|| ';
        case Logical.and:
          return '&& ';
        default:
          return '';
      }
    }

    return list.map(item => `${logicalToSting(item.operator)}${expressionToString(item)}`).join('\n');
  }
}

function getName(action: Action | null): string {
  return action?.parentId ?? '';
}
