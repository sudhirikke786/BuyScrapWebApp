import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedBackSuggestionComponent } from './feed-back-suggestion.component';

describe('FeedBackSuggestionComponent', () => {
  let component: FeedBackSuggestionComponent;
  let fixture: ComponentFixture<FeedBackSuggestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedBackSuggestionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedBackSuggestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
