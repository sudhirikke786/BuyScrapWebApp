import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SysprefComponent } from './syspref.component';

describe('SysprefComponent', () => {
  let component: SysprefComponent;
  let fixture: ComponentFixture<SysprefComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SysprefComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SysprefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
