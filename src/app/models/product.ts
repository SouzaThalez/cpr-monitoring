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

// chaves dos ícones desenhados em productIcons
export type ProductIconKey =
  | 'activity'
  | 'award'
  | 'calendar'
  | 'chart'
  | 'clock'
  | 'cloud'
  | 'drop'
  | 'edit'
  | 'file'
  | 'folder'
  | 'heart'
  | 'lock'
  | 'money'
  | 'shield'
  | 'sliders'
  | 'tool'
  | 'users'
  | 'zap';

export interface ProductFeature {
  icon: ProductIconKey;
  title: string;
  description: string;
}

export interface ProductStep {
  title: string;
  description: string;
}

export interface ProductHighlight {
  icon: ProductIconKey;
  label: string;
}

// conteúdo exibido apenas na página de detalhes do produto
export interface ProductDetailContent {
  tagline: string;               // ex.: 'Plataforma completa'
  title: string;
  description: string;
  features: ProductFeature[];    // recursos da plataforma
  stepsTitle: string;            // ex.: 'Como funciona'
  steps: ProductStep[];
  highlights: ProductHighlight[];// selos de confiança exibidos em faixa
  audienceTitle: string;         // ex.: 'Para quem é'
  audience: string[];
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
  details: ProductDetailContent;
  ctaTitle: string;
  ctaDescription: string;
}