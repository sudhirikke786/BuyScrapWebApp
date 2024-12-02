import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InoutDashboardComponent } from './inout-dashboard.component';

describe('InoutDashboardComponent', () => {
  let component: InoutDashboardComponent;
  let fixture: ComponentFixture<InoutDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InoutDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InoutDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
