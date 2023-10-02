import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PenSignatureComponent } from './pen-signature.component';

describe('PenSignatureComponent', () => {
  let component: PenSignatureComponent;
  let fixture: ComponentFixture<PenSignatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PenSignatureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PenSignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
