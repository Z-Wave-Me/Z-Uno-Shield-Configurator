import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

export interface Position {
  total: number;
  current: number;
}
@Component({
  selector: 'configurator-order-changer[position]',
  templateUrl: './order-changer.component.html',
  styleUrls: ['./order-changer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderChangerComponent {
  private _position!: Position;

  public list: number[] = [];

  @Input()
  public set position(position: Position) {
    this.list = Array.from({ length: position.total }).map((_, i) => i);
    this._position = position;
  }

  public get position(): Position {
    return this._position;
  }

  @Output()
  public indexChange = new EventEmitter<{ from: number, to: number }>();
}
