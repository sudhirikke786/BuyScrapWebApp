import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InoutDetailsComponent } from './inout-details.component';

describe('InoutDetailsComponent', () => {
  let component: InoutDetailsComponent;
  let fixture: ComponentFixture<InoutDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InoutDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InoutDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
