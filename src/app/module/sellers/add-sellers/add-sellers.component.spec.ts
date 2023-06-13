import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSellersComponent } from './add-sellers.component';

describe('AddSellersComponent', () => {
  let component: AddSellersComponent;
  let fixture: ComponentFixture<AddSellersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSellersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSellersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
