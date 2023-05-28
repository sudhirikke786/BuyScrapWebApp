import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellersBuyersDashboardComponent } from './sellers-buyers-dashboard.component';

describe('SellersBuyersDashboardComponent', () => {
  let component: SellersBuyersDashboardComponent;
  let fixture: ComponentFixture<SellersBuyersDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellersBuyersDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellersBuyersDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
