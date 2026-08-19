import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Setup } from './components/setup/setup';
import { LandPage } from './components/land-page/land-page';

const routes: Routes = [
  {
    path: 'land-page',
    component: LandPage
  },
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
    redirectTo: 'land-page'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
