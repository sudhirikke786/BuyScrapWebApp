import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubMaterialReportComponent } from './sub-material-report.component';

describe('SubMaterialReportComponent', () => {
  let component: SubMaterialReportComponent;
  let fixture: ComponentFixture<SubMaterialReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubMaterialReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubMaterialReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
