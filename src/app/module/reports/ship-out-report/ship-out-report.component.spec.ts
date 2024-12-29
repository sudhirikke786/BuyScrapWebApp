import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipOutReportComponent } from './ship-out-report.component';

describe('ShipOutReportComponent', () => {
  let component: ShipOutReportComponent;
  let fixture: ComponentFixture<ShipOutReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShipOutReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShipOutReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
