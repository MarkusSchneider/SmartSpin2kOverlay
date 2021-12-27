import { TestBed } from '@angular/core/testing';
import { IpcRendererEvent } from 'electron';
import { MessageReceived } from 'src/app/shared';
import { Mock } from 'ts-mocks';
import { RuntimeValues } from '.';
import { ElectronService, IpcRenderer } from '../electron/electron.service';

import { SmartSpinValuesService } from './smart-spin-values.service';

describe('SmartSpinValuesService', () => {
  // const data = '21	N 4429 ERG_Mode_CSV: "cycles;current incline;new incline;current setpoint;new setpoint;current watts;new watts;current cadence;new cadence;"';
  const event: IpcRendererEvent = new Mock<IpcRendererEvent>().Object;

  let electronService: ElectronService;
  let service: SmartSpinValuesService;
  let ipcRenderer: IpcRenderer;
  let listener: (event: IpcRendererEvent, ...args: any[]) => void;

  beforeEach(() => {
    ipcRenderer = new Mock<IpcRenderer>({
      on: (_channel: string, _listener: (event: IpcRendererEvent, ...args: any[]) => void) => {
        listener = _listener
      },
      send: () => { }
    }).Object

    electronService = new Mock<ElectronService>({ ipcRenderer: ipcRenderer }).Object;
    TestBed.configureTestingModule({
      providers: [
        SmartSpinValuesService,
        { provide: ElectronService, useValue: electronService },
      ]
    }).compileComponents();

    service = TestBed.inject(SmartSpinValuesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('ctor', () => {
    it('should register on udpData Event', () => {
      // Assert
      expect(electronService.ipcRenderer?.on).toHaveBeenCalledWith(MessageReceived, jasmine.any(Function));
    });
  });

  describe('__processMessage', () => {
    it('should handle not update value if lines is empty', () => {
      // Arrange
      const values$ = service.getRuntimeValues();
      let values: RuntimeValues | null = null;

      // Act
      values$.subscribe({
        next: val => values = val
      });
      listener(event, []);

      // Assert
      expect(values).toBeNull();
    });

    it('should handle not update value if lines is not ERG_Mode_CSV', () => {
      // Arrange
      const data = '21	N 4429 ERG_Mode: ""';
      const values$ = service.getRuntimeValues();
      let values: RuntimeValues | null = null;

      // Act
      values$.subscribe({
        next: val => values = val
      });
      listener(event, [data]);

      // Assert
      expect(values).toBeNull();
    });

    it('should parse line', () => {
      // Arrange
      const data = 'N 72199 ERG_Mode_CSV: "1;996.00;918.00;120;121;154;146;86;87"';

      const values$ = service.getRuntimeValues();
      let values: RuntimeValues | null = null;

      // Act
      values$.subscribe({
        next: val => values = val
      });
      listener(event, [data]);

      // Assert
      expect(values).not.toBeNull();
      if (values != null) {
        const rtValue: RuntimeValues = {
          cycle: 1,
          currentIncline: 996,
          newIncline: 918,
          currentSetpoint: 120,
          newSetpoint: 121,
          currentWatts: 154,
          newWatts: 146,
          currentCadence: 86,
          newCadence: 87,
        };
        expect(values).toEqual(rtValue);
      }
    });

    it('should not parse line if less than 9 arguments present', () => {
      // Arrange
      const data = 'N 72199 ERG_Mode_CSV: "1;996.00;918.00;120;121;154;146;86"';

      const values$ = service.getRuntimeValues();
      let values: RuntimeValues | null = null;

      // Act
      values$.subscribe({
        next: val => values = val
      });
      listener(event, data);

      // Assert
      expect(values).toBeNull();
    });
  });
});
