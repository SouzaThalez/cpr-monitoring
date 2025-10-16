import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivateRoutingModule } from './private-routing-module';
import { Private } from './private';
import { Topnavigation } from './topnavigation/topnavigation';
import { CprNotes } from './cpr-notes/cpr-notes';
import { PostCpr } from './post-cpr/post-cpr';
import { CprReview } from './cpr-review/cpr-review';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    Private,
    Topnavigation,
    CprNotes,
    PostCpr,
    CprReview
  ],
  imports: [
    CommonModule,
    PrivateRoutingModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    HttpClientModule,
  
  ]
})
export class PrivateModule { }
