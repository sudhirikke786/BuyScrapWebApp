import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InOutReportComponent } from './in-out-report.component';

describe('InOutReportComponent', () => {
  let component: InOutReportComponent;
  let fixture: ComponentFixture<InOutReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InOutReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InOutReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
