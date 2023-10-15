import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChipWrapperComponent } from './chip-wrapper.component';

describe('ChipWrapperComponent', () => {
  let component: ChipWrapperComponent;
  let fixture: ComponentFixture<ChipWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChipWrapperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChipWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
