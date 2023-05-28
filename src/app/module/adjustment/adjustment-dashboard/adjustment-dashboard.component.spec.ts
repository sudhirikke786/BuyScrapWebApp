import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustmentDashboardComponent } from './adjustment-dashboard.component';

describe('AdjustmentDashboardComponent', () => {
  let component: AdjustmentDashboardComponent;
  let fixture: ComponentFixture<AdjustmentDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdjustmentDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdjustmentDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
