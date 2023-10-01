import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThumbFingerComponent } from './thumb-finger.component';

describe('ThumbFingerComponent', () => {
  let component: ThumbFingerComponent;
  let fixture: ComponentFixture<ThumbFingerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ThumbFingerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThumbFingerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
