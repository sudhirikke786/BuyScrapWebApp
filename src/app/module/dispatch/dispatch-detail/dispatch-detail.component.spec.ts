import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchDetailComponent } from './dispatch-detail.component';

describe('DispatchDetailComponent', () => {
  let component: DispatchDetailComponent;
  let fixture: ComponentFixture<DispatchDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DispatchDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DispatchDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
