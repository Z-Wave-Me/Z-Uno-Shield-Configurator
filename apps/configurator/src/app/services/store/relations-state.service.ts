import { computed, effect, Injectable, Signal, signal } from '@angular/core';

export interface Relation {
  target: string
}

@Injectable({
  providedIn: 'root',
})
export class RelationsStateService {
  private readonly state = signal<Record<string, Relation>>({});
  constructor() {
    effect(() => {
      console.log('Data changed', this.state());
    })
  }

  public update(rule: Relation, key: string): void {
    this.state.mutate((rules) => rules[key] = rule);
    // this.state.update((rules) => rules.set(key, rule));
  }

  public remove(key: string): void {
    // this.state.mutate(rules => delete r(key))
  }

  public relations(): Signal<Record<string, Relation>> {
    return this.state.asReadonly();
  }
}
