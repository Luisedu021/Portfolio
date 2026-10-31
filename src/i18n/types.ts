import type { CompanyKey, ExperienceKey, ProjectCategory, SectionId } from '../data/content'

export type Language = 'pt' | 'en'

export type FlowStep = { label: string; detail: string }

export type Service = {
  number: string
  title: string
  tags: string[]
  description: string
  /** Itens mostrados quando a linha é expandida. */
  details: string[]
  /** Texto do botão dentro da área expandida. */
  cta: string
  /** Diagrama animado "gatilho → IA → ação" (usado em IA & automações). */
  flow?: FlowStep[]
}

export type ExperienceText = { role: string; description: string }

/** Todos os textos do site. pt.ts e en.ts precisam ter exatamente esta forma. */
export type Dictionary = {
  meta: { description: string }
  nav: Record<SectionId, string> & { label: string; cta: string }
  controls: {
    language: string
    toDark: string
    toLight: string
    openMenu: string
    closeMenu: string
  }
  hero: {
    /** Selo de vidro acima da frase */
    badgeName: string
    badgeRole: string
    /** Frase de impacto: início + trecho em destaque (degradê) */
    titleStart: string
    titleHighlight: string
    support: string
    primaryCta: string
    secondaryCta: string
    photoAlt: string
  }
  services: {
    titleLines: [string, string]
    cta: string
    expand: (title: string) => string
    collapse: (title: string) => string
    flowLabel: string
    items: Service[]
  }
  about: { title: string; body: string }
  experience: {
    title: string
    /** Período de cada empresa */
    periods: Record<CompanyKey, string>
    /** Cargo e descrição de cada função */
    items: Record<ExperienceKey, ExperienceText>
  }
  education: {
    title: string
    degree: string
    institution: string
    /** Ex.: "2º ano de 4" */
    progress: (year: number, total: number) => string
    /** Rótulos da linha do tempo: primeiro ano, ano atual e último ano */
    start: string
    now: string
    graduation: string
    language: {
      status: string
      title: string
      exam: string
      result: string
      /** Rótulo acima da escala A1–C2 */
      scale: string
      /** Link que abre o PDF do resultado da Cambridge */
      certificate: string
    }
  }
  projects: {
    titleStart: string
    titleHighlight: string
    body: string
    challengeLabel: string
    resultLabel: string
    viewCase: string
    close: string
    open: (title: string) => string
    /** Nome de cada categoria (uma coluna por categoria) */
    categories: Record<ProjectCategory, string>
    count: (total: number) => string
    previous: string
    next: string
    /** Texto alternativo das telas nos mockups */
    screen: (title: string) => string
  }
  contact: {
    title: string
    body: string
    emailLabel: string
    whatsappLabel: string
    whatsappMessage: string
    fields: { name: string; email: string; phone: string; location: string; project: string; message: string }
    submit: string
    sending: string
    sent: string
    failed: string
    mailSubject: (project: string) => string
  }
  footer: { rights: string; backToTop: string }
}
