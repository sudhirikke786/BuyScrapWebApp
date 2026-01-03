import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScaleMachineComponent } from './scale-machine.component';

describe('ScaleMachineComponent', () => {
  let component: ScaleMachineComponent;
  let fixture: ComponentFixture<ScaleMachineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScaleMachineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScaleMachineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
