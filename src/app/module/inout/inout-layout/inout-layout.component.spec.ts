import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InoutLayoutComponent } from './inout-layout.component';

describe('InoutLayoutComponent', () => {
  let component: InoutLayoutComponent;
  let fixture: ComponentFixture<InoutLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InoutLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InoutLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
