import type { Dictionary } from './types'

const serviceTags = ['UI/UX', 'Figma', 'Prototyping']

export const en: Dictionary = {
  meta: {
    description: 'Luís Eduardo — Product Designer and developer: automations and products built with AI.',
  },
  nav: {
    label: 'Main',
    cta: "Let's talk",
    inicio: 'Home',
    sobre: 'About',
    servicos: 'Services',
    educacao: 'Education',
    projetos: 'Projects',
    contato: 'Contact',
  },
  controls: {
    language: 'Language',
    toDark: 'Switch to dark mode',
    toLight: 'Switch to light mode',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
  },
  hero: {
    badgeName: 'Luís Eduardo',
    badgeRole: 'Product Designer · Automation & AI',
    titleStart: 'Where great design meets ',
    titleHighlight: 'clean code.',
    support: 'I help startups and businesses build web and mobile products, from prototype to deploy.',
    primaryCta: "Let's work together",
    secondaryCta: 'See my work',
    photoAlt: 'Photo of Luís Eduardo',
  },
  services: {
    titleLines: ['How I help', 'you grow?'],
    cta: 'Start a project',
    expand: (title) => `See details of ${title}`,
    collapse: (title) => `Collapse ${title}`,
    flowLabel: 'How an automation works',
    items: [
      {
        number: '01',
        title: 'AI & automation',
        tags: ['AI', 'Automation', 'APIs'],
        description: 'Focused on automating processes, improving productivity and generating value and more conversion!',
        details: [
          'AI agents and chatbots for support, sales and customer service',
          'Automation of repetitive tasks and workflows across tools',
          'System integrations through APIs and webhooks',
          'Reports and dashboards that update themselves',
        ],
        cta: 'Automate my business',
        flow: [
          { label: 'Trigger', detail: 'Message, form or event' },
          { label: 'AI agent', detail: 'Understands, decides and replies' },
          { label: 'Action', detail: 'Updates CRM, sheet or replies' },
        ],
      },
      {
        number: '02',
        title: 'Product Design',
        tags: serviceTags,
        description: 'Focused on product thinking that converts and sparks interest in the audience.',
        details: [
          'Problem discovery with real users',
          'Information architecture and user flows',
          'Usability testing and continuous iteration',
          'Metrics to validate every design decision',
        ],
        cta: 'Design my product',
      },
      {
        number: '03',
        title: 'UI/UX Design',
        tags: serviceTags,
        description: 'Focused on design psychology and layouts that convert.',
        details: [
          'Wireframes and clickable prototypes in Figma',
          'Consistent interfaces built on a design system',
          'Responsive layouts focused on conversion',
          'Organized handoff for the development team',
        ],
        cta: 'Improve my interface',
      },
      {
        number: '04',
        title: 'Development',
        tags: serviceTags,
        description: 'Focused on developing applications, e-commerce, landing pages and apps.',
        details: [
          'Fast, responsive websites and landing pages',
          'Fullstack web apps: front-end, APIs and databases',
          'Deployment, technical SEO and performance tuning',
          'Ongoing maintenance and product evolution',
        ],
        cta: 'Build my website',
      },
    ],
  },
  about: {
    title: 'About',
    body: "I'm Luís Eduardo, a product designer studying Computer Science at UFMS. I use AI to take solutions from the problem to a live product, from Figma to code. I led the Iron Capi team in shipping 90+ screens and a working prototype in 7 days, and I've automated processes and built data pipelines. Today I'm a UI/UX Designer and developer at Ouronova and Mega Jr., where I've also served as commercial director.",
  },
  experience: {
    title: 'My professional experience',
    periods: {
      megaJr: 'August 2025 – present',
      ouronova: 'May 2026 – present',
    },
    items: {
      megaDesigner: {
        role: 'UI/UX Designer',
        description:
          'Worked as a UI/UX Designer on projects such as the COP-15 landing page (presented at Integra UFMS 2025), a landing page for an acupuncturist and the website of the junior enterprise Múltipla.',
      },
      megaDirector: {
        role: 'Commercial Director',
        description:
          'Under my leadership, we doubled lead volume and billed 2.7x the target, handling lead conversations, conversion meetings and contracts.',
      },
      megaDev: {
        role: 'Web Dev.',
        description:
          'Worked as a web developer on landing pages for different niches, such as corporate and healthcare.',
      },
      ouronova: {
        role: 'UI/UX Designer & Dev.',
        description:
          'Redesigned flows in a module of Wellnova, software used by oil and gas companies in Brazil and Europe, where a single mistake forced users to redo the whole process. I also build with React, TypeScript, Python/Django, PostgreSQL and MySQL.',
      },
    },
  },
  education: {
    title: 'Education',
    degree: "Bachelor's in Computer Science",
    institution: 'Federal University of Mato Grosso do Sul',
    progress: (year, total) => `Year ${year} of ${total}`,
    start: 'Start',
    now: 'Now',
    graduation: 'Graduation',
    language: {
      status: 'Certified',
      title: 'Fluent English',
      exam: 'Cambridge B2 First (FCE)',
      result: 'Certified at C1 level',
      scale: 'Level C1 of C2',
      certificate: 'View official result',
    },
  },
  projects: {
    titleStart: 'My ',
    titleHighlight: 'projects',
    body: 'Projects by category. Open one and use the arrows to browse each project.',
    challengeLabel: 'Challenge',
    resultLabel: 'Result',
    viewCase: 'View project',
    close: 'Close project',
    open: (title) => `Open ${title}`,
    categories: { landing: 'Landing page', uiux: 'UI/UX', software: 'Software' },
    count: (total) => (total === 1 ? '1 project' : `${total} projects`),
    previous: 'Previous project',
    next: 'Next project',
    screen: (title) => `Screen from the ${title} project`,
  },
  contact: {
    title: "Let's talk about your project",
    body: "Tell me a bit about your idea or project and let's talk about how I can help.",
    emailLabel: 'Email',
    whatsappLabel: 'WhatsApp',
    whatsappMessage: "Hi, Luís! I saw your portfolio and I'd like to talk about a project.",
    fields: {
      name: 'Name',
      email: 'Email',
      phone: 'WhatsApp (with country code)',
      location: 'Location',
      project: 'Project',
      message: 'Message',
    },
    submit: 'Send',
    sending: 'Sending...',
    sent: "Message sent! I'll get back to you soon.",
    failed: "Couldn't send it right now. Try again or email me.",
    mailSubject: (project) => `New project: ${project}`,
  },
  footer: { rights: 'All rights reserved.', backToTop: 'Back to top' },
}
