import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildDeviceConfiguratorComponent } from './child-device-configurator.component';

describe('ChildPinConfiguratorComponent', () => {
  let component: ChildDeviceConfiguratorComponent;
  let fixture: ComponentFixture<ChildDeviceConfiguratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChildDeviceConfiguratorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChildDeviceConfiguratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
