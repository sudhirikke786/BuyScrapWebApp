import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperadminSidemenuComponent } from './superadmin-sidemenu.component';

describe('SuperadminSidemenuComponent', () => {
  let component: SuperadminSidemenuComponent;
  let fixture: ComponentFixture<SuperadminSidemenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperadminSidemenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperadminSidemenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
