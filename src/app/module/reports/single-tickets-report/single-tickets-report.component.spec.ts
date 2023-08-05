import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleTicketsReportComponent } from './single-tickets-report.component';

describe('SingleTicketsReportComponent', () => {
  let component: SingleTicketsReportComponent;
  let fixture: ComponentFixture<SingleTicketsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleTicketsReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleTicketsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
