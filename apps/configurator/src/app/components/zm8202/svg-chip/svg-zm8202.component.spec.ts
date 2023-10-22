import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SvgZm8202Component } from './svg-zm8202.component';

describe('SvgChipComponent', () => {
  let component: SvgZm8202Component;
  let fixture: ComponentFixture<SvgZm8202Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SvgZm8202Component],
    }).compileComponents();

    fixture = TestBed.createComponent(SvgZm8202Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
