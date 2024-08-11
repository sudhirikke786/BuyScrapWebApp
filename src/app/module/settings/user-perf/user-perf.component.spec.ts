import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPerfComponent } from './user-perf.component';

describe('UserPerfComponent', () => {
  let component: UserPerfComponent;
  let fixture: ComponentFixture<UserPerfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserPerfComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPerfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
