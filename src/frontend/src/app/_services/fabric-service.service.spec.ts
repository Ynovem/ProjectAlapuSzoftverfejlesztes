import { TestBed } from '@angular/core/testing';

import { FabricServiceService } from './fabric-service.service';

describe('FabricServiceService', () => {
  let service: FabricServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FabricServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
