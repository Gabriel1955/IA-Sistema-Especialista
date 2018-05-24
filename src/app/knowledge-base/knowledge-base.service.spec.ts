import { TestBed, inject } from '@angular/core/testing';

import { KnowledgeBaseService } from './knowledge-base.service';

describe('KnowledgeBaseService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KnowledgeBaseService]
    });
  });

  it('should be created', inject([KnowledgeBaseService], (service: KnowledgeBaseService) => {
    expect(service).toBeTruthy();
  }));
});
