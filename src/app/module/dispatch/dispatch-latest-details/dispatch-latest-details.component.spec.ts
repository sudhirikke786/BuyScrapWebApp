import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchLatestDetailsComponent } from './dispatch-latest-details.component';

describe('DispatchLatestDetailsComponent', () => {
  let component: DispatchLatestDetailsComponent;
  let fixture: ComponentFixture<DispatchLatestDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DispatchLatestDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DispatchLatestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
