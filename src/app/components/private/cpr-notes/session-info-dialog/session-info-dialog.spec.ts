import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionInfoDialog } from './session-info-dialog';

describe('SessionInfoDialog', () => {
  let component: SessionInfoDialog;
  let fixture: ComponentFixture<SessionInfoDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SessionInfoDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionInfoDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
