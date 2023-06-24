import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildPinConfiguratorComponent } from './child-pin-configurator.component';

describe('ChildPinConfiguratorComponent', () => {
  let component: ChildPinConfiguratorComponent;
  let fixture: ComponentFixture<ChildPinConfiguratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChildPinConfiguratorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChildPinConfiguratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
