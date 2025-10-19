import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonReview } from './lesson-review';

describe('LessonReview', () => {
  let component: LessonReview;
  let fixture: ComponentFixture<LessonReview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LessonReview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonReview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
