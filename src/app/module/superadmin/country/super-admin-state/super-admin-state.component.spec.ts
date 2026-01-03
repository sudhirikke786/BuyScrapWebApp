import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminStateComponent } from './super-admin-state.component';

describe('SuperAdminStateComponent', () => {
  let component: SuperAdminStateComponent;
  let fixture: ComponentFixture<SuperAdminStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperAdminStateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperAdminStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
