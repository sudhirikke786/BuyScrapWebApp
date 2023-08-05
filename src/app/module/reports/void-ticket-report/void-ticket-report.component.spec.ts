import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoidTicketReportComponent } from './void-ticket-report.component';

describe('VoidTicketReportComponent', () => {
  let component: VoidTicketReportComponent;
  let fixture: ComponentFixture<VoidTicketReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoidTicketReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoidTicketReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
