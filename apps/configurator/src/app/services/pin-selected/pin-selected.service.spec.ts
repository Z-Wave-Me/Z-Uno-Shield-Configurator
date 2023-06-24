import { TestBed } from '@angular/core/testing';

import { PinSelectedService } from './pin-selected.service';

describe('PinSelectedService', () => {
  let service: PinSelectedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PinSelectedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
