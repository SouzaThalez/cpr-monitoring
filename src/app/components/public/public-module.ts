import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing-module';
import { Setup } from './setup/setup';
import {MatButtonModule} from '@angular/material/button';


@NgModule({
  declarations: [
    Setup
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    MatButtonModule
    
  ]
})
export class PublicModule { }
