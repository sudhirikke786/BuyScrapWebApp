import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashierSettingsComponent } from './cashier-settings.component';

describe('CashierSettingsComponent', () => {
  let component: CashierSettingsComponent;
  let fixture: ComponentFixture<CashierSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashierSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashierSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
