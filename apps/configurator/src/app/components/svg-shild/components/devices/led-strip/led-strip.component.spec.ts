import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LedStripComponent } from './led-strip.component';

describe('SundboxComponent', () => {
  let component: LedStripComponent;
  let fixture: ComponentFixture<LedStripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LedStripComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LedStripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
