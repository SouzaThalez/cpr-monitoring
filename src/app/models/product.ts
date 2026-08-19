export interface ProductImage {
  src: string;
  alt: string;
}

export interface ProductPlan {
  label: string;                 // ex.: 'Para começar'
  name: string;                  // ex.: 'Gratuito'
  price: string;                 // ex.: 'R$ 0'
  period: string;                // ex.: '/ mês'
  description: string;
  features: string[];
  buttonLabel: string;
  featured: boolean;             // destaca o card e usa o botão primário
  featuredLabel?: string;        // ex.: 'Mais completo'
}

export interface Product {
  slug: string;                  // usado na rota /landing-page/product/:slug
  name: string;
  category: string;              // ex.: 'Sistema para saúde'
  description: string;
  logo: ProductImage;
  logoContain?: boolean;         // true quando a logo deve preencher o quadro sem ajuste manual
  images: ProductImage[];
  plansTitle: string;
  plansDescription: string;
  plans: ProductPlan[];
  ctaTitle: string;
  ctaDescription: string;
}