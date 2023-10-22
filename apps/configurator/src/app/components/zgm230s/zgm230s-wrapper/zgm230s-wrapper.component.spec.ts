import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Zgm230sWrapperComponent } from './zgm230s-wrapper.component';

describe('ChipWrapperComponent', () => {
  let component: Zgm230sWrapperComponent;
  let fixture: ComponentFixture<Zgm230sWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Zgm230sWrapperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Zgm230sWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
