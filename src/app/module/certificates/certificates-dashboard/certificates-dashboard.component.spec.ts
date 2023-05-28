import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificatesDashboardComponent } from './certificates-dashboard.component';

describe('CertificatesDashboardComponent', () => {
  let component: CertificatesDashboardComponent;
  let fixture: ComponentFixture<CertificatesDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CertificatesDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertificatesDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
