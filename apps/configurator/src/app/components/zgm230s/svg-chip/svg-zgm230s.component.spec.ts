import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SvgZgm230sComponent } from './svg-zgm230s.component';

describe('SvgChipComponent', () => {
  let component: SvgZgm230sComponent;
  let fixture: ComponentFixture<SvgZgm230sComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SvgZgm230sComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SvgZgm230sComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
