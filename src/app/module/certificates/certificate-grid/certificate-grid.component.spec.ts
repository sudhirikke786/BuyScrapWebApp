import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateGridComponent } from './certificate-grid.component';

describe('CertificateGridComponent', () => {
  let component: CertificateGridComponent;
  let fixture: ComponentFixture<CertificateGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CertificateGridComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertificateGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
