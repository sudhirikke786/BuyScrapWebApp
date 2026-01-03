import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminCountryComponent } from './super-admin-country.component';

describe('SuperAdminCountryComponent', () => {
  let component: SuperAdminCountryComponent;
  let fixture: ComponentFixture<SuperAdminCountryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperAdminCountryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperAdminCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
