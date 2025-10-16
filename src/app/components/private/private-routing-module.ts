import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Private } from './private';
import { CprNotes } from './cpr-notes/cpr-notes';
import { PostCpr } from './post-cpr/post-cpr';
import { CprReview } from './cpr-review/cpr-review';

const routes: Routes = [
  {
    path: '',
    component: Private,
    children:[
      {
        path:'pcr-anotacoes',
        component:CprNotes
      },
       {
        path:'cuidados-pos',
        component:PostCpr
      },
       {
        path:'pcr-review',
        component:CprReview
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivateRoutingModule { }
