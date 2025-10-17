import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveDialog } from './save-dialog';

describe('SaveDialog', () => {
  let component: SaveDialog;
  let fixture: ComponentFixture<SaveDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaveDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaveDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
