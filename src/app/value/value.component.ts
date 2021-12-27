import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-value',
  templateUrl: './value.component.html',
  styleUrls: ['./value.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class ValueComponent implements OnChanges {

  @Input()
  public label: string = '';

  @Input()
  public currentValue: number = 0;

  @Input()
  public targetValue: number = 0;

  public constructor(private readonly _changeDetector: ChangeDetectorRef) {
  }

  ngOnChanges(_changes: SimpleChanges): void {
    this._changeDetector.markForCheck();
  }
}
