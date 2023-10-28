import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PinConfiguratorComponent } from './pin-configurator.component';

describe('PinConfiguratorComponent', () => {
  let component: PinConfiguratorComponent;
  let fixture: ComponentFixture<PinConfiguratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PinConfiguratorComponent ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(PinConfiguratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
