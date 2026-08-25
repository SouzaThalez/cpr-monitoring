import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product, ProductPlan } from '../../models/product';
import { productsData, findProductBySlug } from '../../data/productsData';
import { productIcons } from '../../data/productIcons';

@Component({
  selector: 'app-product-details',
  standalone: false,
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss'
})
export class ProductDetails implements OnInit {

  product?: Product;

  // traçados dos ícones, usados pelo template
  icons = productIcons;

  // demais produtos, usados na navegação do rodapé da página
  otherProducts: Product[] = [];

  activeImageIndex = 0;

  @ViewChild('plansSection') plansSection?: ElementRef<HTMLElement>;


  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}


  ngOnInit(): void {

    // o paramMap é observado para cobrir a troca de produto sem recriar o componente
    this.route.paramMap.subscribe((params) => {
      this.loadProduct(params.get('slug'));
    });

  }


  private loadProduct(slug: string | null): void {

    const product = findProductBySlug(slug);

    // slug inválido volta para a land page
    if (!product) {
      this.router.navigate(['/land-page']);
      return;
    }

    this.product = product;
    this.otherProducts = productsData.filter((item) => item.slug !== product.slug);
    this.activeImageIndex = 0;

    window.scrollTo({ top: 0 });

  }


  selectImage(index: number): void {
    this.activeImageIndex = index;
  }


  goBack(): void {
    this.router.navigate(['/land-page']);
  }


  // rola até a seção de planos, na mesma página
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
