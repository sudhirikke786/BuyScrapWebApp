import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InoutGridComponent } from './inout-grid.component';

describe('InoutGridComponent', () => {
  let component: InoutGridComponent;
  let fixture: ComponentFixture<InoutGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InoutGridComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InoutGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
