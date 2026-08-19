import { Product } from '../models/product';

export const productsData: Product[] = [
  {
    slug: 'linchpin',
    name: 'Linchpin',
    category: 'Sistema para saúde',
    description:
      'Uma plataforma desenvolvida para facilitar o gerenciamento de processos, registros e atividades em ambientes de saúde, tornando as informações mais organizadas e acessíveis.',
    logo: {
      src: 'assets/images/login-linchpin.png',
      alt: 'Linchpin'
    },
    images: [
      {
        src: 'assets/images/table-product.png',
        alt: 'Dashboard do sistema Linchpin'
      },
      {
        src: 'assets/images/linchpin-product/registro-aula.png',
        alt: 'Tela de login do sistema Linchpin'
      }
    ],
    plansTitle: 'Escolha a melhor opção',
    plansDescription: 'Comece gratuitamente ou tenha acesso a recursos avançados.',
    plans: [
      {
        label: 'Para começar',
        name: 'Gratuito',
        price: 'R$ 0',
        period: '/ mês',
        description: 'Ideal para conhecer a plataforma e começar a organizar seus processos.',
        features: [
          'Acesso à plataforma',
          'Registro de atividades',
          'Dashboard básico',
          'Relatórios básicos'
        ],
        buttonLabel: 'Começar gratuitamente',
        featured: false
      },
      {
        label: 'Para profissionais',
        name: 'Profissional',
        price: 'R$ 29',
        period: '/ mês',
        description:
          'Recursos completos para profissionais e instituições que precisam de maior controle e produtividade.',
        features: [
          'Tudo do plano gratuito',
          'Relatórios avançados',
          'Indicadores e métricas',
          'Histórico completo',
          'Suporte prioritário'
        ],
        buttonLabel: 'Quero o plano profissional',
        featured: true,
        featuredLabel: 'Mais completo'
      }
    ],
    ctaTitle: 'Pronto para começar?',
    ctaDescription:
      'Experimente o Linchpin e descubra uma forma mais simples de organizar seus processos.'
  },

  {
    slug: 'selathcare',
    name: 'SelathCare',
    category: 'Gestão em saúde',
    description:
      'Uma solução digital para facilitar a gestão de clínicas, consultórios e serviços de saúde, centralizando informações e proporcionando uma visão mais estratégica dos processos.',
    logo: {
      src: 'assets/images/selath-inovation-logo.png',
      alt: 'SelathCare'
    },
    logoContain: true,
    images: [
      {
        src: 'assets/images/login-linchpin.png',
        alt: 'Plataforma SelathCare apresentada em um tablet'
      }
    ],
    plansTitle: 'Escolha a melhor opção',
    plansDescription: 'Comece gratuitamente ou tenha acesso a recursos avançados.',
    plans: [
      {
        label: 'Para começar',
        name: 'Gratuito',
        price: 'R$ 0',
        period: '/ mês',
        description: 'Ideal para conhecer a plataforma e organizar os primeiros atendimentos.',
        features: [
          'Cadastro de pacientes',
          'Agenda de atendimentos',
          'Prontuário simplificado',
          'Dashboard básico'
        ],
        buttonLabel: 'Começar gratuitamente',
        featured: false
      },
      {
        label: 'Para clínicas',
        name: 'Profissional',
        price: 'R$ 39',
        period: '/ mês',
        description:
          'Gestão completa para clínicas e serviços de saúde que precisam de controle e previsibilidade.',
        features: [
          'Tudo do plano gratuito',
          'Gestão financeira',
          'Múltiplos profissionais',
          'Indicadores e métricas',
          'Suporte prioritário'
        ],
        buttonLabel: 'Quero o plano profissional',
        featured: true,
        featuredLabel: 'Mais completo'
      }
    ],
    ctaTitle: 'Pronto para começar?',
    ctaDescription:
      'Experimente o SelathCare e tenha uma visão completa da gestão do seu serviço de saúde.'
  },

  {
    slug: 'mooncpr',
    name: 'MoonCpr',
    category: 'Processos e ensino',
    description:
      'Uma plataforma para organização de fluxos, protocolos e processos, ajudando equipes a trabalharem de forma mais eficiente e estruturada.',
    logo: {
      src: 'assets/images/logo-img.png',
      alt: 'MoonCpr'
    },
    logoContain: true,
    images: [
      {
        src: 'assets/images/moon-cpr-img.png',
        alt: 'Plataforma MoonCpr apresentada em um tablet'
      }
    ],
    plansTitle: 'Escolha a melhor opção',
    plansDescription: 'Comece gratuitamente ou tenha acesso a recursos avançados.',
    plans: [
      {
        label: 'Para começar',
        name: 'Gratuito',
        price: 'R$ 0',
        period: '/ mês',
        description: 'Ideal para conhecer a plataforma e acompanhar as primeiras simulações.',
        features: [
          'Registro de atendimentos',
          'Protocolos guiados',
          'Modo aula',
          'Relatórios básicos'
        ],
        buttonLabel: 'Começar gratuitamente',
        featured: false
      },
      {
        label: 'Para instituições',
        name: 'Profissional',
        price: 'R$ 25',
        period: '/ mês',
        description:
          'Recursos avançados para instituições de ensino e equipes que treinam com frequência.',
        features: [
          'Tudo do plano gratuito',
          'Relatórios avançados',
          'Histórico completo de sessões',
          'Indicadores de desempenho',
          'Suporte prioritário'
        ],
        buttonLabel: 'Quero o plano profissional',
        featured: true,
        featuredLabel: 'Mais completo'
      }
    ],
    ctaTitle: 'Pronto para começar?',
    ctaDescription:
      'Experimente o MoonCpr e estruture os protocolos da sua equipe de forma simples.'
  }
];

export const defaultProductSlug = 'linchpin';

export function findProductBySlug(slug: string | null): Product | undefined {
  return productsData.find((product) => product.slug === slug);
}