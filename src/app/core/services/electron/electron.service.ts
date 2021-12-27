import { Injectable, NgZone } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, IpcRendererEvent } from 'electron';
// import * as childProcess from 'child_process';
// import * as fs from 'fs';

function isElectron(): boolean {
  return window?.process != null && window.process.type != null;
}

@Injectable({
  providedIn: 'root'
})
export class ElectronService {
  public ipcRenderer: IpcRenderer | null = null;
  // public webFrame: typeof webFrame | null = null;
  // public childProcess: typeof childProcess | null = null;
  // public fs: typeof fs | null = null;

  constructor(ngZone: NgZone) {
    // Conditional imports
    this.ipcRenderer = new IpcRenderer(ngZone);
    // this.webFrame = window.require('electron').webFrame;

    // this.childProcess = window.require('child_process');
    // this.fs = window.require('fs');

    // Notes :
    // * A NodeJS's dependency imported with 'window.require' MUST BE present in `dependencies` of both `app/package.json`
    // and `package.json (root folder)` in order to make it work here in Electron's Renderer process (src folder)
    // because it will loaded at runtime by Electron.
    // * A NodeJS's dependency imported with TS module import (ex: import { Dropbox } from 'dropbox') CAN only be present
    // in `dependencies` of `package.json (root folder)` because it is loaded during build phase and does not need to be
    // in the final bundle. Reminder : only if not used in Electron's Main process (app folder)

    // If you want to use a NodeJS 3rd party deps in Renderer process,
    // ipcRenderer.invoke can serve many common use cases.
    // https://www.electronjs.org/docs/latest/api/ipc-renderer#ipcrendererinvokechannel-args
  }
}

export class IpcRenderer {
  private _ipcRenderer: typeof ipcRenderer | null = null;

  public constructor(private readonly _ngZone: NgZone) {
    if (isElectron()) {
      this._ipcRenderer = window.require('electron').ipcRenderer;
    }
  }

  public on(channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void): void {
    this._ipcRenderer?.on(channel, (event: IpcRendererEvent, ...args: any[]) => {
      this._ngZone.run(() => {
        listener(event, args);
      })
    })
  }

  public send(channel: string, ...args: any[]): void {
    this._ipcRenderer?.send(channel, args);
  }
}
