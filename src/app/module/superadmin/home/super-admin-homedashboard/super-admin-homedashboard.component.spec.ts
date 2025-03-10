import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminHomedashboardComponent } from './super-admin-homedashboard.component';

describe('SuperAdminHomedashboardComponent', () => {
  let component: SuperAdminHomedashboardComponent;
  let fixture: ComponentFixture<SuperAdminHomedashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperAdminHomedashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperAdminHomedashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
