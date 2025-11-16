import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Setup } from './components/setup/setup';

const routes: Routes = [
  {
    path: 'setup',
    component: Setup
  },
  {
    path: 'lesson',
    loadChildren: () => import('./components/public/public-module').then((module) => module.PublicModule),
  },
  {
    path: 'private',
    loadChildren: () => import('./components/private/private-module').then((module) => module.PrivateModule),
  },
  {
    path: '**',
    redirectTo: 'setup'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
