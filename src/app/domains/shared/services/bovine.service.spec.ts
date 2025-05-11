import { TestBed } from '@angular/core/testing';

import { BovineService } from './bovine.service';

describe('BovineService', () => {
  let service: BovineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BovineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
