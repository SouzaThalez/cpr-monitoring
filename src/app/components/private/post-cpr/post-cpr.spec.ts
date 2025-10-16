import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostCpr } from './post-cpr';

describe('PostCpr', () => {
  let component: PostCpr;
  let fixture: ComponentFixture<PostCpr>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PostCpr]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostCpr);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
