import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Signal } from '@angular/core';
import config from '../../../../config/config.json';
import { AssociationStateService } from '../../../services/store/association-state.service';
import { Association } from '@configurator/shared';

@Component({
  selector: 'configurator-associations',
  templateUrl: './associations.component.html',
  styleUrls: ['./associations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssociationsComponent {

  public list: Association[] = config.associations as Association[];

  public data: Signal<Association[]>;
  constructor(
    private readonly relationsStateService: AssociationStateService,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {
    this.data = this.relationsStateService.associations();
  }

  public addItem(item: Association): void {
    const uuid = crypto.randomUUID();
    this.relationsStateService.update({ ...item, uuid });
    this.changeDetectorRef.detectChanges();
  }

  public removeItem(item: Association): void {
   this.relationsStateService.remove(item)
  }
}
