import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CprReview } from './cpr-review';

describe('CprReview', () => {
  let component: CprReview;
  let fixture: ComponentFixture<CprReview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CprReview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CprReview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
