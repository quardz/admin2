import { TestBed } from '@angular/core/testing';

import { WpcoreService } from './wpcore.service';

describe('WpcoreService', () => {
  let service: WpcoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WpcoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
