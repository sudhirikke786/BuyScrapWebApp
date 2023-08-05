import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyTicketsReportComponent } from './daily-tickets-report.component';

describe('DailyTicketsReportComponent', () => {
  let component: DailyTicketsReportComponent;
  let fixture: ComponentFixture<DailyTicketsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyTicketsReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyTicketsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
