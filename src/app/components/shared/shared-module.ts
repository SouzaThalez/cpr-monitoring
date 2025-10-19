import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Topnavigation } from './topnavigation/topnavigation';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    Topnavigation
  ],
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports:[
    Topnavigation
  ]
})
export class SharedModule { }
