import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerscountComponent } from './sellerscount.component';

describe('SellerscountComponent', () => {
  let component: SellerscountComponent;
  let fixture: ComponentFixture<SellerscountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellerscountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
