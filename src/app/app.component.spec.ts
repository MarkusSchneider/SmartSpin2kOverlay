import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ElectronService, IpcRenderer, SmartSpinValuesService } from './core/services';
import { Mock } from 'ts-mocks'
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CloseWindow } from '../../app/shared';

describe('AppComponent', () => {
  let electronService: ElectronService;
  let smartSpinValuesService: SmartSpinValuesService;
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(waitForAsync(() => {
    const ipcRenderer: IpcRenderer = new Mock<IpcRenderer>({ on: () => ipcRenderer, send: () => { } }).Object
    electronService = new Mock<ElectronService>({ ipcRenderer: ipcRenderer }).Object;

    smartSpinValuesService = new Mock<SmartSpinValuesService>({ getRuntimeValues: () => of() }).Object;

    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: ElectronService, useValue: electronService },
        { provide: SmartSpinValuesService, useValue: smartSpinValuesService }
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', waitForAsync(() => {
    expect(component).toBeTruthy();
  }));

  describe('ngOnInit', () => {
    it('should getRuntimeValues', () => {
      // Arrange

      // Act
      component.ngOnInit();

      // Assert
      expect(smartSpinValuesService.getRuntimeValues).toHaveBeenCalled();
    });
  });

  describe('__onCloseClick', () => {
    it('should send CloseWindowEvent', () => {
      // Arrange

      // Act
      component.__onCloseClick();

      // Assert
      expect(electronService.ipcRenderer?.send).toHaveBeenCalledWith(CloseWindow);
    });
  });
});
