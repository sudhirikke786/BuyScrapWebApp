import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLocationManagementComponent } from './admin-location-management.component';

describe('AdminLocationManagementComponent', () => {
  let component: AdminLocationManagementComponent;
  let fixture: ComponentFixture<AdminLocationManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminLocationManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminLocationManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
