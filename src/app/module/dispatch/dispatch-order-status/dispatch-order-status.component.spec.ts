import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchOrderStatusComponent } from './dispatch-order-status.component';

describe('DispatchOrderStatusComponent', () => {
  let component: DispatchOrderStatusComponent;
  let fixture: ComponentFixture<DispatchOrderStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DispatchOrderStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DispatchOrderStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
