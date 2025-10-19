import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LessonCprNotes } from './lesson-cpr-notes/lesson-cpr-notes';
import { Public } from './public';
import { LessonPosPcr } from './lesson-pos-pcr/lesson-pos-pcr';
import { LessonReview } from './lesson-review/lesson-review';

const routes: Routes = [
  {
    path:'',
    component: Public,
    children:[
      {
        path:'aula-anotacoes',
        component:LessonCprNotes
      },
        {
        path:'aula-pos-pcr',
        component:LessonPosPcr
      },
        {
        path:'aula-review',
        component:LessonReview
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
