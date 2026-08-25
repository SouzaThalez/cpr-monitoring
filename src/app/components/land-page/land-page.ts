import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
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

  mobileMenuOpen = false;

  @ViewChild('plansSection') plansSection?: ElementRef<HTMLElement>;


  constructor(private router: Router) {}


  toggleProductsMenu(): void {
    this.productsMenuOpen = !this.productsMenuOpen;
  }


  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    this.productsMenuOpen = false;
  }


  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
    this.productsMenuOpen = false;
  }


  selectProduct(product: Product): void {
    this.selectedProduct = product;
    this.closeMobileMenu();
  }


  @HostListener('document:click')
  closeProductsMenu(): void {
    this.productsMenuOpen = false;
  }


  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeMobileMenu();
  }


  // fecha o menu mobile ao voltar para a largura de desktop
  @HostListener('window:resize')
  onResize(): void {

    if (window.innerWidth > 950) {
      this.closeMobileMenu();
    }

  }


  // abre a página de detalhes do produto selecionado
  openProductDetails(): void {
    this.router.navigate(['/land-page/product', this.selectedProduct.slug]);
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
