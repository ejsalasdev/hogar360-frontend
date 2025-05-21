import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { HouseService } from './house.service';

describe('HouseService', () => {
  let service: HouseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(HouseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
