import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Setup } from './setup/setup';

const routes: Routes = [
  {
    path:'',
    component: Setup
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
