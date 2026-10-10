import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../models/product';
import { productsData, findProductBySlug } from '../../data/productsData';
import { WaitlistEntry, WaitlistService } from '../../services/waitlist-service';

@Component({
  selector: 'app-waitlist',
  standalone: false,
  templateUrl: './waitlist.html',
  styleUrl: './waitlist.scss'
})
export class Waitlist implements OnInit {

  products: Product[] = productsData;

  // produto escolhido pelo usuário; o primeiro da lista é o padrão
  selectedProduct: Product = productsData[0];

  name = '';

  institution = '';

  role = '';

  email = '';

  // opções do menu "Gostaria de usar esta plataforma para?"
  purposeOptions: string[] = [
    'Cursos',
    'Aulas',
    'Avaliação',
    'Treinamentos',
    'Outros',
  ];

  purpose = '';

  // mensagem exibida abaixo do formulário quando algo está incompleto
  errorMessage = '';

  submitted = false;

  // bloqueia o botão enquanto o cadastro está a caminho do Apps Script
  sending = false;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private waitlistService: WaitlistService
  ) {}


  ngOnInit(): void {
    this.selectedProduct = this.resolveProduct();
  }


  selectProduct(product: Product): void {
    this.selectedProduct = product;
    this.errorMessage = '';
  }


  isSelected(product: Product): boolean {
    return this.selectedProduct.slug === product.slug;
  }


  // limpa o aviso de erro assim que o usuário corrige qualquer campo
  onFieldChange(): void {
    this.errorMessage = '';
  }


  submit(): void {
debugger
    if (this.sending) {
      return;
    }

    if (!this.name.trim()) {
      this.errorMessage = 'Informe o seu nome.';
      return;
    }

    if (!this.institution.trim()) {
      this.errorMessage = 'Informe a sua instituição.';
      return;
    }

    if (!this.role.trim()) {
      this.errorMessage = 'Informe o seu cargo.';
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Informe um e-mail válido para receber as novidades.';
      return;
    }

    if (!this.purpose) {
      this.errorMessage = 'Escolha para que você pretende usar a plataforma.';
      return;
    }

    this.errorMessage = '';
    this.sending = true;

    this.waitlistService.register(this.buildEntry()).subscribe({

      next: () => {
        this.sending = false;
        this.submitted = true;
      },

      error: (error) => {
        this.sending = false;
        this.errorMessage =
          'Não foi possível enviar o seu cadastro agora. Tente novamente em alguns instantes.';
        console.error('Falha ao enviar o cadastro da lista de espera', error);
      }

    });

  }


  // permite cadastrar outro e-mail sem sair da página
  reset(): void {
    this.submitted = false;
    this.sending = false;
    this.selectedProduct = this.resolveProduct();
    this.name = '';
    this.institution = '';
    this.role = '';
    this.email = '';
    this.purpose = '';
    this.errorMessage = '';
  }


  goBack(): void {
    this.router.navigate(['/land-page']);
  }


  private buildEntry(): WaitlistEntry {

    return {
      name: this.name.trim(),
      institution: this.institution.trim(),
      role: this.role.trim(),
      email: this.email.trim(),
      purpose: this.purpose,
      productName: this.selectedProduct.name,
      productSlug: this.selectedProduct.slug,
      productUrl: this.buildProductUrl(),
      accessUrl: this.buildAccessUrl()
    };

  }


  // página de apresentação do produto
  private buildProductUrl(): string {
    return this.buildUrl(`land-page/product/${this.selectedProduct.slug}`);
  }


  // link para usar o produto; vazio enquanto ele não foi publicado
  private buildAccessUrl(): string {

    const accessUrl = this.selectedProduct.accessUrl;

    return accessUrl ? this.buildUrl(accessUrl) : '';

  }


  // o base href muda entre o ng serve e o GitHub Pages, e o baseURI cobre os
  // dois; URL absoluta passa intacta, então accessUrl aceita os dois formatos
  private buildUrl(path: string): string {
    return new URL(path, document.baseURI).href;
  }


  // o produto vem da land page pela query string; sem ela usa o primeiro da lista
  private resolveProduct(): Product {

    const slug = this.route.snapshot.queryParamMap.get('produto');

    return findProductBySlug(slug) ?? productsData[0];

  }


  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
  }

}
