import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Topnavigation } from './topnavigation';

describe('Topnavigation', () => {
  let component: Topnavigation;
  let fixture: ComponentFixture<Topnavigation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Topnavigation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Topnavigation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
