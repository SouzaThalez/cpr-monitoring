import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../models/product';
import { productsData } from '../../data/productsData';

@Component({
  selector: 'app-about',
  standalone: false,
  templateUrl: './about.html',
  styleUrl: './about.scss'
})
export class About {

  products: Product[] = productsData;


  constructor(private router: Router) {}


  goBack(): void {
    this.router.navigate(['/land-page']);
  }


  openWaitlist(): void {
    this.router.navigate(['/lista-espera']);
  }

}
