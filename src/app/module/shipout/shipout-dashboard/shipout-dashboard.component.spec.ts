import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipoutDashboardComponent } from './shipout-dashboard.component';

describe('ShipoutDashboardComponent', () => {
  let component: ShipoutDashboardComponent;
  let fixture: ComponentFixture<ShipoutDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShipoutDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShipoutDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
