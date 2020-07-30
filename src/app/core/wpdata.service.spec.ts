import { TestBed } from '@angular/core/testing';

import { WpdataService } from './wpdata.service';

describe('WpdataService', () => {
  let service: WpdataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WpdataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
