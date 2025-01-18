import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialPriceListComponent } from './material-price-list.component';

describe('MaterialPriceListComponent', () => {
  let component: MaterialPriceListComponent;
  let fixture: ComponentFixture<MaterialPriceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialPriceListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialPriceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
