import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemPerfComponent } from './system-perf.component';

describe('SystemPerfComponent', () => {
  let component: SystemPerfComponent;
  let fixture: ComponentFixture<SystemPerfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SystemPerfComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SystemPerfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
