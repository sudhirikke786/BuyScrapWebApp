import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesOrderDashboardComponent } from './sales-order-dashboard.component';

describe('SalesOrderDashboardComponent', () => {
  let component: SalesOrderDashboardComponent;
  let fixture: ComponentFixture<SalesOrderDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesOrderDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesOrderDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
