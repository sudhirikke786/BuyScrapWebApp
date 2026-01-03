import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencySettingComponent } from './currency-setting.component';

describe('CurrencySettingComponent', () => {
  let component: CurrencySettingComponent;
  let fixture: ComponentFixture<CurrencySettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrencySettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrencySettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
