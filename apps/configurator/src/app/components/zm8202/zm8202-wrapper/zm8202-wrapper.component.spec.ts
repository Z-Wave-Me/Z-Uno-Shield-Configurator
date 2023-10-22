import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Zm8202WrapperComponent } from './zm8202-wrapper.component';

describe('ChipWrapperComponent', () => {
  let component: Zm8202WrapperComponent;
  let fixture: ComponentFixture<Zm8202WrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Zm8202WrapperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Zm8202WrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
