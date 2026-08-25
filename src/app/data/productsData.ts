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
    details: {
      tagline: 'Tecnologia que conecta',
      title: 'Soluções que transformam a gestão de simuladores',
      description:
        'Do registro da aula ao relatório de uso, o Linchpin reúne em um só lugar tudo o que acontece com os simuladores do seu laboratório.',
      features: [
        {
          icon: 'drop',
          title: 'Limpeza',
          description: 'Controle e registre as limpezas dos simuladores robóticos.'
        },
        {
          icon: 'edit',
          title: 'Registro de aula',
          description: 'Registre as aulas e simulações realizadas nos simuladores.'
        },
        {
          icon: 'tool',
          title: 'Chamados',
          description: 'Acompanhe e gerencie os chamados técnicos de manutenção.'
        },
        {
          icon: 'file',
          title: 'Relatórios',
          description: 'Visualize relatórios de uso, limpeza, performance e mais.'
        },
        {
          icon: 'chart',
          title: 'Visão geral',
          description: 'Um painel inicial com os registros recentes e os números do mês.'
        },
        {
          icon: 'sliders',
          title: 'Gestão de acessos',
          description: 'Organize os perfis da equipe e defina o que cada um pode fazer.'
        }
      ],
      stepsTitle: 'Como funciona',
      steps: [
        {
          title: 'Cadastre os simuladores',
          description:
            'Organize o parque por fidelidade — baixa, média e alta — e mantenha a ficha de cada equipamento sempre à mão.'
        },
        {
          title: 'Registre o dia a dia',
          description:
            'Aulas, limpezas e ocorrências entram na plataforma em poucos cliques, direto pelo tablet do laboratório.'
        },
        {
          title: 'Acompanhe por relatórios',
          description:
            'Os relatórios de habilidade e de fidelidade ficam disponíveis para consulta e download quando você precisar.'
        }
      ],
      highlights: [
        { icon: 'shield', label: 'Segurança de dados' },
        { icon: 'lock', label: 'Conformidade LGPD' },
        { icon: 'cloud', label: 'Acesso em tempo real' },
        { icon: 'chart', label: 'Indicadores que geram resultados' }
      ],
      audienceTitle: 'Para quem é',
      audience: [
        'Laboratórios de simulação realística',
        'Instituições de ensino em saúde',
        'Equipes de manutenção e suporte técnico',
        'Coordenações de curso'
      ]
    },
    ctaTitle: 'Pronto para começar?',
    ctaDescription:
      'Experimente o Linchpin e descubra uma forma mais simples de organizar seus processos.'
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
    details: {
      tagline: 'Plataforma completa',
      title: 'Gestão de intervenções com mais controle e segurança',
      description:
        'Registre, acompanhe e analise todas as intervenções em simulação clínica de forma simples e eficiente.',
      features: [
        {
          icon: 'activity',
          title: 'RCP — anotador',
          description:
            'Registre todas as intervenções da parada com o contador de tempo sempre visível.'
        },
        {
          icon: 'heart',
          title: 'Cuidados pós-PCR',
          description: 'Continue o registro dos cuidados aplicados depois do retorno da circulação.'
        },
        {
          icon: 'clock',
          title: 'Histórico de sessão',
          description: 'Cada intervenção fica salva com o tempo exato em que aconteceu.'
        },
        {
          icon: 'zap',
          title: 'Registro rápido e intuitivo',
          description: 'Ritmo, compressões, drogas e procedimentos a um clique de distância.'
        },
        {
          icon: 'file',
          title: 'Download da sessão',
          description: 'Baixe o registro completo do atendimento para revisar com a turma.'
        },
        {
          icon: 'users',
          title: 'Modo aula',
          description: 'Identifique professor e turma para acompanhar cada simulação separadamente.'
        }
      ],
      stepsTitle: 'Como funciona',
      steps: [
        {
          title: 'Abra a sessão',
          description:
            'Informe o professor e a aula, escolha o cenário e inicie o contador do atendimento.'
        },
        {
          title: 'Registre as intervenções',
          description:
            'Ritmo, compressões, drogas e procedimentos entram no histórico com o tempo exato de cada ação.'
        },
        {
          title: 'Revise com a equipe',
          description:
            'Ao encerrar, baixe o histórico da sessão e conduza o debriefing com dados reais em mãos.'
        }
      ],
      highlights: [
        { icon: 'shield', label: 'Registro seguro' },
        { icon: 'clock', label: 'Acompanhamento em tempo real' },
        { icon: 'award', label: 'Protocolos padronizados' },
        { icon: 'file', label: 'Histórico para debriefing' }
      ],
      audienceTitle: 'Para quem é',
      audience: [
        'Cursos de medicina e enfermagem',
        'Centros de simulação realística',
        'Ligas acadêmicas e cursos de emergência',
        'Equipes que treinam PCR com frequência'
      ]
    },
    ctaTitle: 'Pronto para começar?',
    ctaDescription:
      'Experimente o MoonCpr e estruture os protocolos da sua equipe de forma simples.'
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
    details: {
      tagline: 'Gestão em saúde',
      title: 'Uma visão completa do seu serviço de saúde',
      description:
        'Pacientes, agenda, prontuário e resultados em um único lugar, para clínicas e consultórios que querem crescer com organização.',
      features: [
        {
          icon: 'users',
          title: 'Cadastro de pacientes',
          description: 'Todo o histórico do paciente centralizado e fácil de encontrar.'
        },
        {
          icon: 'calendar',
          title: 'Agenda de atendimentos',
          description: 'Organize os horários da equipe e reduza faltas e encaixes perdidos.'
        },
        {
          icon: 'folder',
          title: 'Prontuário digital',
          description: 'Registre a evolução dos atendimentos de forma simples e segura.'
        },
        {
          icon: 'money',
          title: 'Gestão financeira',
          description: 'Acompanhe recebimentos, despesas e o resultado do mês.'
        },
        {
          icon: 'chart',
          title: 'Indicadores e métricas',
          description: 'Enxergue a operação da clínica em números para decidir com clareza.'
        },
        {
          icon: 'sliders',
          title: 'Múltiplos profissionais',
          description: 'Cada profissional com seu acesso, sua agenda e seus registros.'
        }
      ],
      stepsTitle: 'Como funciona',
      steps: [
        {
          title: 'Configure a sua clínica',
          description:
            'Cadastre profissionais, serviços e horários de atendimento em poucos minutos.'
        },
        {
          title: 'Atenda com tudo registrado',
          description:
            'Agenda, prontuário e cobrança acontecem no mesmo fluxo, sem retrabalho e sem planilha paralela.'
        },
        {
          title: 'Acompanhe os resultados',
          description:
            'Indicadores de atendimentos e de finanças mostram como a clínica está evoluindo mês a mês.'
        }
      ],
      highlights: [
        { icon: 'shield', label: 'Segurança de dados' },
        { icon: 'lock', label: 'Conformidade LGPD' },
        { icon: 'cloud', label: 'Acesso de qualquer lugar' },
        { icon: 'clock', label: 'Suporte quando precisar' }
      ],
      audienceTitle: 'Para quem é',
      audience: [
        'Clínicas e consultórios',
        'Serviços de saúde multiprofissionais',
        'Gestores e administradores',
        'Profissionais autônomos'
      ]
    },
    ctaTitle: 'Pronto para começar?',
    ctaDescription:
      'Experimente o SelathCare e tenha uma visão completa da gestão do seu serviço de saúde.'
  },

];

export const defaultProductSlug = 'linchpin';

export function findProductBySlug(slug: string | null): Product | undefined {
  return productsData.find((product) => product.slug === slug);
}