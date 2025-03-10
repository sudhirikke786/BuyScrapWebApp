import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperadminlayoutComponent } from './superadminlayout.component';

describe('SuperadminlayoutComponent', () => {
  let component: SuperadminlayoutComponent;
  let fixture: ComponentFixture<SuperadminlayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperadminlayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperadminlayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
