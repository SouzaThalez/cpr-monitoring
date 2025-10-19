import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicRoutingModule } from './public-routing-module';
import {MatButtonModule} from '@angular/material/button';
import { LessonCprNotes } from './lesson-cpr-notes/lesson-cpr-notes';
import { SharedModule } from '../shared/shared-module';
import { Public } from './public';
import { LessonPosPcr } from './lesson-pos-pcr/lesson-pos-pcr';
import { LessonReview } from './lesson-review/lesson-review';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { SubmitDialog } from './lesson-cpr-notes/submit-dialog/submit-dialog';


@NgModule({
  declarations: [
    Public,
    LessonCprNotes,
    LessonPosPcr,
    LessonReview,
    SubmitDialog,
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    SharedModule
    
  ]
})
export class PublicModule { }
