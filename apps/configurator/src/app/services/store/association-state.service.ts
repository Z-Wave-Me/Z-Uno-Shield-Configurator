import { effect, Injectable, Signal, signal } from '@angular/core';
import { PinsStateService } from './pins-state.service';
import { Association } from '@configurator/arduino-code-gen';


@Injectable({
  providedIn: 'root',
})
export class AssociationStateService {
  private readonly state = signal<Association[]>([]);
  constructor(
    private readonly pinsStateService: PinsStateService,
  ) {

    this.state.set(this.pinsStateService.snapshot.associations)

    effect(() => {
      this.pinsStateService.updateAssociations(this.state());
    })
  }

  public update(association: Association, index: number): void {
    this.state.mutate((associations) => associations[index] = association);
  }

  public remove(index: number): void {
    this.state.update(rules => rules.filter((_, i) => i !== index));
  }

  public associations(): Signal<Association[]> {
    return this.state.asReadonly();
  }
}
