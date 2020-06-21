import { TestBed } from '@angular/core/testing';

import { LibriService } from './libri.service';

describe('LibriService', () => {
  let service: LibriService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LibriService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
