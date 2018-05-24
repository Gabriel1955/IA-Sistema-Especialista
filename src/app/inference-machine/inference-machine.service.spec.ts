import { TestBed, inject } from '@angular/core/testing';

import { InferenceMachineService } from './inference-machine.service';

describe('InferenceMachineService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InferenceMachineService]
    });
  });

  it('should be created', inject([InferenceMachineService], (service: InferenceMachineService) => {
    expect(service).toBeTruthy();
  }));
});
