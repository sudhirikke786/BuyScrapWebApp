import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminCityComponent } from './super-admin-city.component';

describe('SuperAdminCityComponent', () => {
  let component: SuperAdminCityComponent;
  let fixture: ComponentFixture<SuperAdminCityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperAdminCityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperAdminCityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
