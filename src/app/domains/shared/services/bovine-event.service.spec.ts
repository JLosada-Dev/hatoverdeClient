import { TestBed } from '@angular/core/testing';

import { BovineEventService } from './bovine-event.service';

describe('BovineEventService', () => {
  let service: BovineEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BovineEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
