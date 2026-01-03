import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeCashDrawerComponent } from './change-cash-drawer.component';

describe('ChangeCashDrawerComponent', () => {
  let component: ChangeCashDrawerComponent;
  let fixture: ComponentFixture<ChangeCashDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeCashDrawerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeCashDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
