import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellersBuyersDetailsComponent } from './sellers-buyers-details.component';

describe('SellersBuyersDetailsComponent', () => {
  let component: SellersBuyersDetailsComponent;
  let fixture: ComponentFixture<SellersBuyersDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellersBuyersDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellersBuyersDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
