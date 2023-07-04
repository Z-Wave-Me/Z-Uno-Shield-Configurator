import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Signal } from '@angular/core';
import { Relation, RelationsStateService } from '../../services/store/relations-state.service';

@Component({
  selector: 'configurator-relations',
  templateUrl: './relations.component.html',
  styleUrls: ['./relations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RelationsComponent implements OnInit {

  public data: Signal<Record<string, Relation>>;
  constructor(
    private readonly relationsStateService: RelationsStateService,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {
    this.data = this.relationsStateService.relations();
  }

  public ngOnInit(): void {

  }

  public add(): void {
    this.relationsStateService.update({
      target: 'hehe',
    }, Math.random().toString());
    this.changeDetectorRef.detectChanges();
  }
}
