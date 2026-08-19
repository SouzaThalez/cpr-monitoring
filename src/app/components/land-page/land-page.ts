import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Product, ProductPlan } from '../../models/product';
import { productsData, defaultProductSlug, findProductBySlug } from '../../data/productsData';

@Component({
  selector: 'app-land-page',
  standalone: false,
  templateUrl: './land-page.html',
  styleUrl: './land-page.scss'
})
export class LandPage {

  products: Product[] = productsData;

  selectedProduct: Product = findProductBySlug(defaultProductSlug) ?? productsData[0];

  productsMenuOpen = false;

  @ViewChild('plansSection') plansSection?: ElementRef<HTMLElement>;


  toggleProductsMenu(): void {
    this.productsMenuOpen = !this.productsMenuOpen;
  }


  selectProduct(product: Product): void {
    
    this.selectedProduct = product;
    this.productsMenuOpen = false;
  }


  @HostListener('document:click')
  closeProductsMenu(): void {
    this.productsMenuOpen = false;
  }


  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.productsMenuOpen = false;
  }


  // TODO: apontar para a página de detalhes quando ela existir
  openProductDetails(): void {
  }


  // rola até a seção de planos do produto selecionado, na mesma página
  openPlans(): void {
    this.plansSection?.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }


  // TODO: apontar para o checkout / cadastro quando existir
  selectPlan(plan: ProductPlan): void {
  }

}
