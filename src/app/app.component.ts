import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { ElectronService, RuntimeValues, SmartSpinValuesService } from './core/services';
import { CloseWindow } from './shared';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false
})
export class AppComponent implements OnInit {
  public runtimeValues$!: Observable<RuntimeValues>;

  public constructor(
    private readonly _smartSpinService: SmartSpinValuesService,
    private readonly _electronService: ElectronService) {

  }

  public ngOnInit(): void {
    this.runtimeValues$ = this._smartSpinService.getRuntimeValues();
  }

  public __onCloseClick(): void {
    this._electronService.ipcRenderer?.send(CloseWindow);
  }
}
