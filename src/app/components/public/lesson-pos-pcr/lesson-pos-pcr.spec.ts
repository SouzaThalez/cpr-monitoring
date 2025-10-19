import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonPosPcr } from './lesson-pos-pcr';

describe('LessonPosPcr', () => {
  let component: LessonPosPcr;
  let fixture: ComponentFixture<LessonPosPcr>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LessonPosPcr]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonPosPcr);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
