import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminCurrencyComponent } from './super-admin-currency.component';

describe('SuperAdminCurrencyComponent', () => {
  let component: SuperAdminCurrencyComponent;
  let fixture: ComponentFixture<SuperAdminCurrencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperAdminCurrencyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperAdminCurrencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
