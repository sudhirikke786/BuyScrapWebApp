import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchMapComponent } from './dispatch-map.component';

describe('DispatchMapComponent', () => {
  let component: DispatchMapComponent;
  let fixture: ComponentFixture<DispatchMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DispatchMapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DispatchMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
