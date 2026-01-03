import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashDrawerManagementComponent } from './cash-drawer-management.component';

describe('CashDrawerManagementComponent', () => {
  let component: CashDrawerManagementComponent;
  let fixture: ComponentFixture<CashDrawerManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashDrawerManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashDrawerManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
