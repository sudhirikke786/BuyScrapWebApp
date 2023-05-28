import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegradeDashboardComponent } from './regrade-dashboard.component';

describe('RegradeDashboardComponent', () => {
  let component: RegradeDashboardComponent;
  let fixture: ComponentFixture<RegradeDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegradeDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegradeDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
