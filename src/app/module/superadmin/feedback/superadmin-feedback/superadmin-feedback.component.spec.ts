import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperadminFeedbackComponent } from './superadmin-feedback.component';

describe('SuperadminFeedbackComponent', () => {
  let component: SuperadminFeedbackComponent;
  let fixture: ComponentFixture<SuperadminFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperadminFeedbackComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperadminFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
