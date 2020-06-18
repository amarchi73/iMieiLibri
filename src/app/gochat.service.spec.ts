import { TestBed } from '@angular/core/testing';

import { GochatService } from './gochat.service';

describe('GochatService', () => {
  let service: GochatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GochatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
