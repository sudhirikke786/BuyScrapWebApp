import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashDrawerReportComponent } from './cash-drawer-report.component';

describe('CashDrawerReportComponent', () => {
  let component: CashDrawerReportComponent;
  let fixture: ComponentFixture<CashDrawerReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashDrawerReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashDrawerReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
