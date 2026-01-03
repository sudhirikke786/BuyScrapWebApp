import { TestBed } from '@angular/core/testing';

import { TemplatePrintService } from './template-print.service';

describe('TemplatePrintService', () => {
  let service: TemplatePrintService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemplatePrintService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
