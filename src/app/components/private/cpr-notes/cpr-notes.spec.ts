import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CprNotes } from './cpr-notes';

describe('CprNotes', () => {
  let component: CprNotes;
  let fixture: ComponentFixture<CprNotes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CprNotes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CprNotes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
