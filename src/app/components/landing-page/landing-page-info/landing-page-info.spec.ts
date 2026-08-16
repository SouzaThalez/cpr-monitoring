import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPageInfo } from './landing-page-info';

describe('LandingPageInfo', () => {
  let component: LandingPageInfo;
  let fixture: ComponentFixture<LandingPageInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LandingPageInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandingPageInfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
