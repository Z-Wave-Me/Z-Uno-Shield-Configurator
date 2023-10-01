import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SvgChipComponent } from './svg-chip.component';

describe('SvgChipComponent', () => {
  let component: SvgChipComponent;
  let fixture: ComponentFixture<SvgChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SvgChipComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SvgChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
