import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingReportComponent } from './accounting-report.component';

describe('AccountingReportComponent', () => {
  let component: AccountingReportComponent;
  let fixture: ComponentFixture<AccountingReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountingReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
