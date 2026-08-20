import { TestBed } from '@angular/core/testing';

import { fix } from './fix';

describe('Fix', () => {
  let service: fix;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(fix);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
