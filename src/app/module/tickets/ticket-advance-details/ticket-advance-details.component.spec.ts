import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketAdvanceDetailsComponent } from './ticket-advance-details.component';

describe('TicketAdvanceDetailsComponent', () => {
  let component: TicketAdvanceDetailsComponent;
  let fixture: ComponentFixture<TicketAdvanceDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketAdvanceDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketAdvanceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
