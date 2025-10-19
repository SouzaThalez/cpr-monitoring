import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonCprNotes } from './lesson-cpr-notes';

describe('LessonCprNotes', () => {
  let component: LessonCprNotes;
  let fixture: ComponentFixture<LessonCprNotes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LessonCprNotes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonCprNotes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
