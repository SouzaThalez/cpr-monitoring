import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { ProductInfo } from './components/landing-page/product-info/product-info';
import { LandingPageInfo } from './components/landing-page/landing-page-info/landing-page-info';

@NgModule({
  declarations: [
    App,
    ProductInfo,
    LandingPageInfo,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
