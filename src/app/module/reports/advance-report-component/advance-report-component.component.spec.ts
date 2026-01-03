import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceReportComponentComponent } from './advance-report-component.component';

describe('AdvanceReportComponentComponent', () => {
  let component: AdvanceReportComponentComponent;
  let fixture: ComponentFixture<AdvanceReportComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvanceReportComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvanceReportComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
