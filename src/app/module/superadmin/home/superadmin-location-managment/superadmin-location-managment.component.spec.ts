import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperadminLocationManagmentComponent } from './superadmin-location-managment.component';

describe('SuperadminLocationManagmentComponent', () => {
  let component: SuperadminLocationManagmentComponent;
  let fixture: ComponentFixture<SuperadminLocationManagmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperadminLocationManagmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperadminLocationManagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
