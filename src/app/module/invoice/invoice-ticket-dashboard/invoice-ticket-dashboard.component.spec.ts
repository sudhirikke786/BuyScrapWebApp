import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceTicketDashboardComponent } from './invoice-ticket-dashboard.component';

describe('TicketDashboardComponent', () => {
  let component: InvoiceTicketDashboardComponent;
  let fixture: ComponentFixture<InvoiceTicketDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceTicketDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceTicketDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
