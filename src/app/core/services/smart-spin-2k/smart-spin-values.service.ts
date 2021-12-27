import { Injectable } from '@angular/core';
import { IpcRendererEvent } from 'electron';
import { Observable, Subject } from 'rxjs';
import { MessageReceived } from '../../../shared';
import { ElectronService } from '../electron/electron.service';

export interface RuntimeValues {
  cycle: number;
  currentIncline: number;
  newIncline: number;
  currentSetpoint: number;
  newSetpoint: number;
  currentWatts: number;
  newWatts: number;
  currentCadence: number;
  newCadence: number;
}

@Injectable({
  providedIn: 'root'
})
export class SmartSpinValuesService {

  private _rtValue$: Subject<RuntimeValues> = new Subject<RuntimeValues>();

  public constructor(private readonly _electronService: ElectronService) {
    const listener = this.__processMessage.bind(this);
    this._electronService.ipcRenderer?.on(MessageReceived, listener);
  }

  public getRuntimeValues(): Observable<RuntimeValues> {
    return this._rtValue$;
  }

  public __processMessage(_evt: IpcRendererEvent, messages: Array<string>): void {
    if (messages.length < 1) {
      return;
    }
    const msg = messages[0];

    // console.log(`SmartSpinValuesService: __processMessage. msg = ${msg}`);
    const lineTag = 'ERG_Mode_CSV:'
    const index = msg.indexOf(lineTag);
    if (index < 0) {
      return;
    }

    const valuesCsv = msg.substring(index + lineTag.length, msg.length).trim().replace(/"/g, '');
    const chunks = valuesCsv.split(';');
    if (chunks.length < 9) {
      return;
    }

    const value: RuntimeValues = {
      cycle: Number.parseInt(chunks[0], 10),

      currentIncline: Number.parseFloat(chunks[1]),
      newIncline: Number.parseFloat(chunks[2]),

      currentSetpoint: Number.parseInt(chunks[3], 10),
      newSetpoint: Number.parseInt(chunks[4], 10),

      currentWatts: Number.parseInt(chunks[5], 10),
      newWatts: Number.parseInt(chunks[6], 10),

      currentCadence: Number.parseInt(chunks[7], 10),
      newCadence: Number.parseInt(chunks[8], 10),
    }

    console.log(`SmartSpinValuesService: __processMessage. Parsed values.`, value);
    this._rtValue$?.next(value);
  }
}
