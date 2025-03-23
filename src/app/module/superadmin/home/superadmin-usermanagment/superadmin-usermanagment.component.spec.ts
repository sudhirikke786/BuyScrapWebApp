import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperadminUsermanagmentComponent } from './superadmin-usermanagment.component';

describe('SuperadminUsermanagmentComponent', () => {
  let component: SuperadminUsermanagmentComponent;
  let fixture: ComponentFixture<SuperadminUsermanagmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperadminUsermanagmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperadminUsermanagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
