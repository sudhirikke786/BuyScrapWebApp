import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketTrackComponent } from './ticket-track.component';

describe('TicketTrackComponent', () => {
  let component: TicketTrackComponent;
  let fixture: ComponentFixture<TicketTrackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketTrackComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
