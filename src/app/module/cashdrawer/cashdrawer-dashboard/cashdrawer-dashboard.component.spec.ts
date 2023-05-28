import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashdrawerDashboardComponent } from './cashdrawer-dashboard.component';

describe('CashdrawerDashboardComponent', () => {
  let component: CashdrawerDashboardComponent;
  let fixture: ComponentFixture<CashdrawerDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashdrawerDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashdrawerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
