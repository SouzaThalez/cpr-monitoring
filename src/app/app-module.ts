import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { LandPage } from './components/land-page/land-page';
import { ProductDetails } from './components/product-details/product-details';
import { Waitlist } from './components/waitlist/waitlist';
import { About } from './components/about/about';

@NgModule({
  declarations: [
    App,
    LandPage,
    ProductDetails,
    Waitlist,
    About,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
