import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, Signal } from '@angular/core';
import config from '../../../../config/config.json';
import { AssociationStateService } from '../../../services/store/association-state.service';
import { Association } from '@configurator/shared';
import { PinsStateService } from '../../../services/store/pins-state.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'configurator-associations',
  templateUrl: './associations.component.html',
  styleUrls: ['./associations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssociationsComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject<void>();
  // @ts-ignore
  public list: Association[] = config.associations as Association[];

  public data: Signal<Association[]>;
  constructor(
    private readonly relationsStateService: AssociationStateService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly pinsStateService: PinsStateService,
  ) {
    this.data = this.relationsStateService.associations();
  }

  public ngOnInit(): void {
    this.pinsStateService.resetBehaviour().pipe(
      takeUntil(this.destroy$),
    ).subscribe(() => {
      this.relationsStateService.reset();
    })
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public addItem(item: Association): void {
    const parentId = crypto.randomUUID();
    const { actions, ...other} = item;
    this.relationsStateService.update({ ...other, actions: actions.map(a => ({...a, parentId})), uuid: parentId });
    this.changeDetectorRef.detectChanges();
  }

  public removeItem(item: Association): void {
   this.relationsStateService.remove(item)
  }
}
