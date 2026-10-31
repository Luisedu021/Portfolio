import type { Dictionary } from './types'

const serviceTags = ['UI/UX', 'Figma', 'Prototipagem']

export const pt: Dictionary = {
  meta: {
    description: 'Luís Eduardo — Product Designer e desenvolvedor: automações e produtos construídos com IA.',
  },
  nav: {
    label: 'Principal',
    cta: 'Vamos conversar',
    inicio: 'Home',
    sobre: 'Sobre',
    servicos: 'Serviços',
    educacao: 'Educação',
    projetos: 'Projetos',
    contato: 'Contato',
  },
  controls: {
    language: 'Idioma',
    toDark: 'Ativar modo escuro',
    toLight: 'Ativar modo claro',
    openMenu: 'Abrir menu',
    closeMenu: 'Fechar menu',
  },
  hero: {
    badgeName: 'Luís Eduardo',
    badgeRole: 'Product Designer · Automações e IA',
    titleStart: 'Onde o design encontra o ',
    titleHighlight: 'código limpo.',
    support: 'Ajudo startups e empresas a criar produtos web e mobile, do protótipo ao deploy.',
    primaryCta: 'Vamos trabalhar juntos',
    secondaryCta: 'Ver projetos',
    photoAlt: 'Foto de Luís Eduardo',
  },
  services: {
    titleLines: ['Como eu ajudo', 'você a crescer?'],
    cta: 'Iniciar projeto',
    expand: (title) => `Ver detalhes de ${title}`,
    collapse: (title) => `Recolher ${title}`,
    flowLabel: 'Como funciona uma automação',
    // TODO: revise os detalhes de cada serviço — são um ponto de partida.
    items: [
      {
        number: '01',
        title: 'IA & automatizações',
        tags: ['IA', 'Automação', 'APIs'],
        description: 'Focado em automatizar processos, melhorar produtividade e gerar valor e mais conversão!',
        details: [
          'Agentes e chatbots com IA para atendimento, vendas e suporte',
          'Automação de tarefas repetitivas e fluxos entre ferramentas',
          'Integrações entre sistemas via APIs e webhooks',
          'Relatórios e dashboards que se atualizam sozinhos',
        ],
        cta: 'Quero automatizar',
        flow: [
          { label: 'Gatilho', detail: 'Mensagem, formulário ou evento' },
          { label: 'Agente de IA', detail: 'Entende, decide e gera a resposta' },
          { label: 'Ação', detail: 'Atualiza CRM, planilha ou responde' },
        ],
      },
      {
        number: '02',
        title: 'Product Design',
        tags: serviceTags,
        description: 'Focado em pensamento de produtos que convertem e geram interesse no público.',
        details: [
          'Descoberta do problema junto aos usuários',
          'Arquitetura de informação e fluxos de navegação',
          'Testes de usabilidade e iteração contínua',
          'Métricas para validar cada decisão de design',
        ],
        cta: 'Desenhar meu produto',
      },
      {
        number: '03',
        title: 'UI/UX Design',
        tags: serviceTags,
        description: 'Focado em psicologia do design e layouts que convertem.',
        details: [
          'Wireframes e protótipos navegáveis no Figma',
          'Interfaces consistentes a partir de um design system',
          'Layouts responsivos focados em conversão',
          'Handoff organizado para o time de desenvolvimento',
        ],
        cta: 'Melhorar minha interface',
      },
      {
        number: '04',
        title: 'Desenvolvimento',
        tags: serviceTags,
        description: 'Focado em desenvolvimento de aplicações, E-commerces, landing-pages e aplicativos.',
        details: [
          'Sites e landing pages rápidos e responsivos',
          'Aplicações web fullstack: front-end, APIs e banco de dados',
          'Deploy, SEO técnico e otimização de performance',
          'Manutenção e evolução contínua do produto',
        ],
        cta: 'Tirar meu site do papel',
      },
    ],
  },
  about: {
    title: 'Sobre',
    body: 'Sou o Luís Eduardo, designer de produto e estudante de Ciência da Computação na UFMS. Uso IA para levar soluções do problema ao produto no ar, do Figma ao código. Liderei o time do Iron Capi na entrega de 90+ telas e um protótipo funcional em 7 dias, além de automatizar processos e montar pipelines de dados. Hoje sou UI/UX Designer e dev na Ouronova e na Mega Jr., onde também passei pela diretoria comercial.',
  },
  experience: {
    title: 'Minha experiência profissional',
    periods: {
      megaJr: 'Agosto 2025 – até o momento',
      ouronova: 'Maio 2026 – até o momento',
    },
    items: {
      megaDesigner: {
        role: 'UI/UX Designer',
        description:
          'Atuei como UI/UX Designer em projetos como a landing page da COP-15 (apresentada no Integra UFMS 2025), a landing page de um acupunturista e o site da empresa júnior Múltipla.',
      },
      megaDirector: {
        role: 'Diretor comercial',
        description:
          'Na minha gestão, dobramos o volume de leads e faturamos 2,7x a meta, cuidando das conversas com leads, reuniões de conversão e contratos.',
      },
      megaDev: {
        role: 'Dev. Web',
        description:
          'Atuei como desenvolvedor Web em landing pages de diferentes nichos, como empresariais e da área da saúde.',
      },
      ouronova: {
        role: 'UI/UX Designer e Dev.',
        description:
          'Redesenhei fluxos de um módulo do Wellnova, software de empresas de óleo e gás no Brasil e na Europa, em que um erro obrigava o usuário a refazer todo o processo. Também desenvolvo com React, TypeScript, Python/Django, PostgreSQL e MySQL.',
      },
    },
  },
  education: {
    title: 'Educação',
    degree: 'Bacharelado em Ciência da Computação',
    institution: 'Universidade Federal de Mato Grosso do Sul',
    progress: (year, total) => `${year}º ano de ${total}`,
    start: 'Início',
    now: 'Agora',
    graduation: 'Formatura',
    language: {
      status: 'Certificado',
      title: 'Inglês fluente',
      exam: 'Cambridge B2 First (FCE)',
      result: 'Certificado no nível C1',
      scale: 'Nível C1 de C2',
      certificate: 'Ver resultado oficial',
    },
  },
  projects: {
    titleStart: 'Meus ',
    titleHighlight: 'projetos',
    body: 'Projetos por categoria. Abra uma delas e use as setas para ver cada projeto.',
    challengeLabel: 'Desafio',
    resultLabel: 'Resultado',
    viewCase: 'Ver projeto',
    close: 'Fechar projeto',
    open: (title) => `Abrir ${title}`,
    categories: { landing: 'Landing page', uiux: 'UI/UX', software: 'Software' },
    count: (total) => (total === 1 ? '1 projeto' : `${total} projetos`),
    previous: 'Projeto anterior',
    next: 'Próximo projeto',
    screen: (title) => `Tela do projeto ${title}`,
  },
  contact: {
    title: 'Vamos discutir o seu projeto?',
    body: 'Conte um pouco sobre a sua ideia ou projeto e vamos conversar sobre como posso ajudar.',
    emailLabel: 'Email',
    whatsappLabel: 'WhatsApp',
    whatsappMessage: 'Olá, Luís! Vi seu portfólio e quero conversar sobre um projeto.',
    fields: {
      name: 'Nome',
      email: 'Email',
      phone: 'WhatsApp (com DDD)',
      location: 'Localização',
      project: 'Projeto',
      message: 'Mensagem',
    },
    submit: 'Enviar',
    sending: 'Enviando...',
    sent: 'Mensagem enviada! Vou te responder em breve.',
    failed: 'Não consegui enviar agora. Tente de novo ou me chame por email.',
    mailSubject: (project) => `Novo projeto: ${project}`,
  },
  footer: { rights: 'Todos os direitos reservados.', backToTop: 'Voltar ao início' },
}
