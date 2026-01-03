import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderDashboardComponent } from './purchase-order-dashboard.component';

describe('PurchaseOrderDashboardComponent', () => {
  let component: PurchaseOrderDashboardComponent;
  let fixture: ComponentFixture<PurchaseOrderDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseOrderDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseOrderDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
