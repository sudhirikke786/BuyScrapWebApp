import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerDashboardComponent } from './container-dashboard.component';

describe('ContainerDashboardComponent', () => {
  let component: ContainerDashboardComponent;
  let fixture: ComponentFixture<ContainerDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContainerDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContainerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
