import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicRoutingModule } from './public-routing-module';
import {MatButtonModule} from '@angular/material/button';
import { LessonCprNotes } from './lesson-cpr-notes/lesson-cpr-notes';
import { SharedModule } from '../shared/shared-module';
import { Public } from './public';
import { LessonPosPcr } from './lesson-pos-pcr/lesson-pos-pcr';
import { LessonReview } from './lesson-review/lesson-review';


@NgModule({
  declarations: [
    Public,
    LessonCprNotes,
    LessonPosPcr,
    LessonReview,
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    MatButtonModule,
    SharedModule
    
  ]
})
export class PublicModule { }
