import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullCalnderDispatchComponent } from './full-calnder-dispatch.component';

describe('FullCalnderDispatchComponent', () => {
  let component: FullCalnderDispatchComponent;
  let fixture: ComponentFixture<FullCalnderDispatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FullCalnderDispatchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FullCalnderDispatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
