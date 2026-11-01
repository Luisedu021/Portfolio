/*
 * Dados que não mudam com o idioma (links, imagens, ícones).
 * Os textos ficam nos dicionários em src/i18n/pt.ts e src/i18n/en.ts.
 */
import iconGithub from '../assets/icon-github-brand.svg'
import iconInstagram from '../assets/icon-instagram-brand.svg'
import iconLinkedin from '../assets/icon-linkedin-brand.svg'
import iconWhatsapp from '../assets/icon-whatsapp-brand.svg'
import cop15Desktop from '../assets/projects/cop15-desktop.jpg'
import cop15Mobile from '../assets/projects/cop15-mobile.jpg'
import cop15Preview from '../assets/projects/cop15-preview.jpg'
import cop15Tablet from '../assets/projects/cop15-tablet.jpg'
import garanhaniDesktop from '../assets/projects/garanhani-desktop.jpg'
import garanhaniMobile from '../assets/projects/garanhani-mobile.jpg'
import garanhaniPreview from '../assets/projects/garanhani-preview.jpg'
import garanhaniTablet from '../assets/projects/garanhani-tablet.jpg'
import ironCapiHome from '../assets/projects/ironcapi-mobile-home.jpg'
import ironCapiPhoto from '../assets/projects/ironcapi-mobile-photo.jpg'
import ironCapiPreview from '../assets/projects/ironcapi-cover.jpg'
import megaAtasDesktop from '../assets/projects/megaatas-desktop.jpg'
import megaAtasMobile from '../assets/projects/megaatas-mobile.jpg'
import megaAtasPreview from '../assets/projects/megaatas-preview.jpg'
import megaAtasTablet from '../assets/projects/megaatas-tablet.jpg'
import wellnovaDesktop from '../assets/projects/wellnova-desktop.jpg'
import wellnovaMobile from '../assets/projects/wellnova-mobile.jpg'
import wellnovaAppPreview from '../assets/projects/wellnova-app-cover.jpg'
import wellnovaPreview from '../assets/projects/wellnova-preview.jpg'
import wellnovaTablet from '../assets/projects/wellnova-tablet.jpg'
import type { DeviceScreens } from '../components/ui/DeviceMockups'
import type { Language } from '../i18n/types'

/** Ids das seções, na ordem do menu. Os rótulos vêm de `t.nav`. */
// Mesma ordem da página. A Experiência fica fora do menu (menos itens); ao passar por ela, "Sobre" segue ativo.
export const sectionIds = ['inicio', 'servicos', 'sobre', 'educacao', 'projetos', 'contato'] as const
export type SectionId = (typeof sectionIds)[number]

/** Graduação. Curso, instituição e textos vêm de `t.education`; o ano atual do curso é calculado. */
export const education = { startYear: 2025, endYear: 2028 }

/** Escala do Quadro Europeu (CEFR) e meu nível de inglês nela. */
export const cefrLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const
export const englishLevel: (typeof cefrLevels)[number] = 'C1'

/**
 * Linha do tempo, agrupada por empresa (um marcador por empresa, cargos empilhados).
 * Período vem de `t.experience.periods[key]`; cargo e descrição de `t.experience.items[role]`.
 */
export const experiences = [
  { key: 'megaJr', company: 'Mega Jr.', roles: ['megaDesigner', 'megaDirector', 'megaDev'] },
  { key: 'ouronova', company: 'Ouronova', roles: ['ouronova'] },
] as const
export type CompanyKey = (typeof experiences)[number]['key']
export type ExperienceKey = (typeof experiences)[number]['roles'][number]

/** Categorias, na ordem das colunas. Os nomes vêm de `t.projects.categories`. */
export const projectCategories = ['landing', 'uiux', 'software'] as const
export type ProjectCategory = (typeof projectCategories)[number]

/** Textos de um projeto num idioma. Desafio e resultado vazios não aparecem. */
export type ProjectText = { summary: string; challenge: string; result: string }

export type Project = {
  /** Identificador único (o "identificador" no painel). */
  key: string
  category: ProjectCategory
  title: string
  /** Ferramentas e tipo de entrega (iguais nos dois idiomas). */
  tags: string[]
  /**
   * Telas dos mockups do projeto aberto. Só aparecem os aparelhos com tela:
   * notebook + tablet + celular, tablet + celular ou só notebook.
   */
  screens: DeviceScreens
  /** Capa da coluna no hover (aparece o topo da imagem). */
  preview: string
  /** Link do projeto (site, Behance, Figma...). Sem link, o botão não aparece. */
  href?: string
  text: Record<Language, ProjectText>
}

const text = (summaryPt: string, summaryEn: string): Record<Language, ProjectText> => ({
  pt: { summary: summaryPt, challenge: '', result: '' },
  en: { summary: summaryEn, challenge: '', result: '' },
})

/**
 * Projetos usados enquanto a API (painel em backend/) não está configurada ou não responde.
 * Com VITE_API_URL definido, o site lê os projetos do painel (ver src/hooks/useProjects.ts).
 * O primeiro de cada categoria é a capa da coluna.
 */
export const projects: Project[] = [
  {
    key: 'garanhani',
    category: 'landing',
    title: 'Dr. Rafael Garanhani',
    tags: ['Landing page', 'Web'],
    screens: { desktop: garanhaniDesktop, tablet: garanhaniTablet, mobile: garanhaniMobile },
    preview: garanhaniPreview,
    href: 'https://drgaranhani.com.br/',
    text: text(
      'Landing page do consultório do Dr. Rafael Garanhani: acupuntura médica, neuromodulação, homeopatia e clínica geral.',
      "Landing page for Dr. Rafael Garanhani's practice: medical acupuncture, neuromodulation, homeopathy and general care.",
    ),
  },
  {
    key: 'wellnova',
    category: 'landing',
    title: 'Wellnova',
    tags: ['Landing page', 'Front-end'],
    screens: { desktop: wellnovaDesktop, tablet: wellnovaTablet, mobile: wellnovaMobile },
    preview: wellnovaPreview,
    href: 'https://wellnova.ai/',
    text: text(
      'Hotsite público da Wellnova, plataforma de IA para integridade de poços de óleo e gás. Atuei na refatoração do código.',
      "Wellnova's public website, an AI platform for oil and gas well integrity. I worked on refactoring the code.",
    ),
  },
  {
    key: 'ironCapi',
    category: 'uiux',
    title: 'Iron Capi',
    tags: ['UI/UX', 'App'],
    screens: { mobile: ironCapiHome, mobileAlt: ironCapiPhoto },
    preview: ironCapiPreview,
    href: 'https://luisedu021.github.io/Iron-Capi/',
    text: {
      pt: {
        summary:
          'App de treino gamificado para universitários, selecionado pelo Sebrae para o Integra UFMS. Fui tech lead de um time de 4 pessoas e montei um processo de design acelerado com IA.',
        challenge: 'Sair da ideia para um protótipo funcional a tempo do Integra, com um time pequeno e multidisciplinar.',
        result:
          'Com IA em cada etapa do design (referências, análise, geração de telas e revisão), entregamos 90+ telas e o protótipo no ar em 7 dias. Na pesquisa, ~75% de 60+ respostas deixaram contato como interessados.',
      },
      en: {
        summary:
          'Gamified workout app for university students, selected by Sebrae for Integra UFMS. I was tech lead of a 4-person team and set up an AI-accelerated design process.',
        challenge: 'Go from idea to a working prototype in time for Integra, with a small, multidisciplinary team.',
        result:
          'With AI at every design step (references, analysis, screen generation and review), we shipped 90+ screens and a live prototype in 7 days. In our survey, ~75% of 60+ respondents left their contact as interested.',
      },
    },
  },
  {
    key: 'cop15',
    category: 'uiux',
    title: 'COP15 POP UFMS',
    tags: ['UI/UX', 'Web'],
    screens: { desktop: cop15Desktop, tablet: cop15Tablet, mobile: cop15Mobile },
    preview: cop15Preview,
    text: text(
      'Site da COP15 POP UFMS, a programação aberta da UFMS durante a COP15 de espécies migratórias em Campo Grande (março de 2026). Fiz o UI/UX pela Mega Jr.',
      "Website for COP15 POP UFMS, UFMS's public program during the COP15 on migratory species in Campo Grande (March 2026). I did the UI/UX through Mega Jr.",
    ),
  },
  {
    key: 'wellnovaApp',
    category: 'software',
    title: 'Wellnova',
    tags: ['Software', 'Dashboard'],
    // Mesmas imagens do hotsite: as telas internas do sistema não são públicas.
    screens: { desktop: wellnovaDesktop, tablet: wellnovaTablet, mobile: wellnovaMobile },
    preview: wellnovaAppPreview,
    text: {
      pt: {
        summary: 'Plataforma de IA da Wellnova para integridade de poços de óleo e gás. Atuei no redesign de um módulo específico do sistema.',
        challenge: 'Fluxos incompletos em que um erro de preenchimento obrigava o usuário a refazer todo o processo.',
        result: 'Fluxos redesenhados e interface visual aprimorada no módulo.',
      },
      en: {
        summary: "Wellnova's AI platform for oil and gas well integrity. I worked on the redesign of a specific module of the system.",
        challenge: 'Incomplete flows where a single input mistake forced users to redo the whole process.',
        result: 'Redesigned flows and an improved visual interface in the module.',
      },
    },
  },
  {
    key: 'megaAtas',
    category: 'software',
    title: 'Mega Jr. Atas',
    tags: ['JavaScript', 'API'],
    screens: { desktop: megaAtasDesktop, tablet: megaAtasTablet, mobile: megaAtasMobile },
    preview: megaAtasPreview,
    href: 'https://mega-jr-atas.vercel.app/',
    text: {
      pt: {
        summary:
          'Gerador de atas de reunião da Mega Jr.: recebe os detalhes, a data e os pontos importantes e gera um PDF padronizado. Minha primeira automação, de 2026.',
        challenge: 'Redigir atas à mão tomava tempo e cada pessoa escrevia de um jeito.',
        result:
          'Economiza ~10 min por ata; com ~15 atas por mês, são ~30 h por ano devolvidas ao time, com registros no mesmo padrão.',
      },
      en: {
        summary:
          "Mega Jr.'s meeting minutes generator: it takes the details, the date and the key points and outputs a standardized PDF. My first automation, from 2026.",
        challenge: 'Writing minutes by hand took time and everyone wrote them differently.',
        result:
          'It saves ~10 min per meeting; at ~15 meetings a month, that is ~30 hours a year back to the team, with every record in the same format.',
      },
    },
  },
]

export const contact = {
  email: 'dudulopesantos22@gmail.com',
  phone: '(18) 99159-7894',
  /** Abre a conversa no WhatsApp com a mensagem inicial (texto em t.contact.whatsappMessage). */
  whatsappHref: (message: string) => `https://wa.me/5518991597894?text=${encodeURIComponent(message)}`,
}

export const socials = {
  linkedin: { label: 'LinkedIn', href: 'https://www.linkedin.com/in/luisedulopes/', icon: iconLinkedin },
  instagram: { label: 'Instagram', href: 'https://www.instagram.com/luis_edulopes/', icon: iconInstagram },
  github: { label: 'GitHub', href: 'https://github.com/Luisedu021', icon: iconGithub },
  /** O link usa a mensagem inicial no idioma do site: veja socialLinks(). */
  whatsapp: { label: 'WhatsApp', href: '', icon: iconWhatsapp },
}

/** Redes na ordem dos ícones, com o WhatsApp já trazendo a mensagem inicial. */
export function socialLinks(whatsappMessage: string) {
  return [
    socials.linkedin,
    socials.instagram,
    socials.github,
    { ...socials.whatsapp, href: contact.whatsappHref(whatsappMessage) },
  ]
}
