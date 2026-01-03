import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedemptionProgramComponentComponent } from './redemption-program-component.component';

describe('RedemptionProgramComponentComponent', () => {
  let component: RedemptionProgramComponentComponent;
  let fixture: ComponentFixture<RedemptionProgramComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RedemptionProgramComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RedemptionProgramComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
