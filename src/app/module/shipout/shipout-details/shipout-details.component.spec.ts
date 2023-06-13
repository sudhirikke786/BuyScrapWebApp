import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipoutDetailsComponent } from './shipout-details.component';

describe('ShipoutDetailsComponent', () => {
  let component: ShipoutDetailsComponent;
  let fixture: ComponentFixture<ShipoutDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShipoutDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShipoutDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
