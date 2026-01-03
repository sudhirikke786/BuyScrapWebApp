import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperadminSuggestionComponent } from './superadmin-suggestion.component';

describe('SuperadminSuggestionComponent', () => {
  let component: SuperadminSuggestionComponent;
  let fixture: ComponentFixture<SuperadminSuggestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperadminSuggestionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperadminSuggestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
