import { TestBed } from '@angular/core/testing';

import { MilkProductionService } from './milk-production.service';

describe('MilkProductionService', () => {
  let service: MilkProductionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MilkProductionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
