import { TestBed } from '@angular/core/testing';

import { LinkSynchronizerService } from './link-synchronizer.service';

describe('LinkSynchronizerService', () => {
  let service: LinkSynchronizerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LinkSynchronizerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
