import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Setup } from './components/setup/setup';
import { LandingPage } from './components/landing-page/landing-page';
import { ProductInfo } from './components/landing-page/product-info/product-info';
import { LandingPageInfo } from './components/landing-page/landing-page-info/landing-page-info';

const routes: Routes = [ 
  {
    path: 'landing-page',
    component: LandingPage,
    children:[
      {
        path:'product',
        component:ProductInfo
      },
      {
        path:'landing-page-info',
        component:LandingPageInfo
      },
      {
        path: '**',
        redirectTo: 'landing-page-info'
      }
    ]
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
    redirectTo: 'landing-page'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
