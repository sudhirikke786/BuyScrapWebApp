import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrinterPriceComponent } from './printer-price.component';

describe('PrinterPriceComponent', () => {
  let component: PrinterPriceComponent;
  let fixture: ComponentFixture<PrinterPriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrinterPriceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrinterPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
