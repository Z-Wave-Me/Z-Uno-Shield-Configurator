import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgShieldComponent } from './svg-shield.component';

describe('SvgShildComponent', () => {
  let component: SvgShieldComponent;
  let fixture: ComponentFixture<SvgShieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SvgShieldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SvgShieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
