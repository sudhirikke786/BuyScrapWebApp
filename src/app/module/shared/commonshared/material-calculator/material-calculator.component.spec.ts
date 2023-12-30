import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialCalculatorComponent } from './material-calculator.component';

describe('MaterialCalculatorComponent', () => {
  let component: MaterialCalculatorComponent;
  let fixture: ComponentFixture<MaterialCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialCalculatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
