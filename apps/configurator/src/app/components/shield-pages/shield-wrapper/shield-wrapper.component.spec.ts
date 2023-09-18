import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShieldWrapperComponent } from './shield-wrapper.component';

describe('ShieldComponent', () => {
  let component: ShieldWrapperComponent;
  let fixture: ComponentFixture<ShieldWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShieldWrapperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ShieldWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
