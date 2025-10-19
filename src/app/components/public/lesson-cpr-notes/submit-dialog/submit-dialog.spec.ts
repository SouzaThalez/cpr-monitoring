import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitDialog } from './submit-dialog';

describe('SubmitDialog', () => {
  let component: SubmitDialog;
  let fixture: ComponentFixture<SubmitDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubmitDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmitDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
