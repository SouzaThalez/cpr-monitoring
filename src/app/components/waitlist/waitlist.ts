import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../models/product';
import { productsData } from '../../data/productsData';

@Component({
  selector: 'app-waitlist',
  standalone: false,
  templateUrl: './waitlist.html',
  styleUrl: './waitlist.scss'
})
export class Waitlist {

  products: Product[] = productsData;

  // produto escolhido pelo usuário; começa vazio para obrigar a escolha
  selectedProduct?: Product;

  email = '';

  // mensagem exibida abaixo do formulário quando algo está incompleto
  errorMessage = '';

  submitted = false;


  constructor(private router: Router) {}


  selectProduct(product: Product): void {
    this.selectedProduct = product;
    this.errorMessage = '';
  }


  isSelected(product: Product): boolean {
    return this.selectedProduct?.slug === product.slug;
  }


  onEmailChange(): void {
    this.errorMessage = '';
  }


  submit(): void {

    if (!this.selectedProduct) {
      this.errorMessage = 'Escolha o produto que você quer acompanhar.';
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Informe um e-mail válido para receber as novidades.';
      return;
    }

    this.errorMessage = '';
    this.submitted = true;

    // TODO: enviar o cadastro para o backend quando o endpoint existir
  }


  // permite cadastrar outro e-mail sem sair da página
  reset(): void {
    this.submitted = false;
    this.selectedProduct = undefined;
    this.email = '';
    this.errorMessage = '';
  }


  goBack(): void {
    this.router.navigate(['/land-page']);
  }


  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
  }

}
