import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceTicketDetailComponent } from './invoice-ticket-detail.component';

describe('TicketDetailComponent', () => {
  let component: InvoiceTicketDetailComponent;
  let fixture: ComponentFixture<InvoiceTicketDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceTicketDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceTicketDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
