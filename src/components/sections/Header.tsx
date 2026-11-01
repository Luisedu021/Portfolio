import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { sectionIds } from '../../data/content'
import { useActiveSection } from '../../hooks/useActiveSection'
import { useI18n } from '../../i18n/context'
import { cn } from '../../lib/cn'
import { EASE_OUT } from '../../lib/motion'
import { CurlyArrow } from '../ui/CurlyArrow'
import { LanguageSwitch } from '../ui/LanguageSwitch'
import { ThemeToggle } from '../ui/ThemeToggle'

const enter = (delay: number) => ({
  initial: { opacity: 0, y: -16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: EASE_OUT, delay },
})

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'

/** Ícone do botão de menu: três pontos na vertical (kebab), que viram um X quando o menu abre. */
function KebabIcon({ open }: { open: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <AnimatePresence mode="wait" initial={false}>
        {open ? (
          <motion.path
            key="close"
            d="M6 6l12 12M18 6L6 18"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
            style={{ transformOrigin: 'center' }}
          />
        ) : (
          <motion.g
            key="dots"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
            style={{ transformOrigin: 'center' }}
          >
            <circle cx="12" cy="5" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="12" cy="19" r="2" />
          </motion.g>
        )}
      </AnimatePresence>
    </svg>
  )
}

/**
 * Barra do menu (Figma: Hero 104:1305 › barra superior). Desktop: idioma e tema, menu
 * e "Entre em contato". Celular e tablet: idioma e tema, e o menu num botão kebab.
 */
export function Header() {
  const { t } = useI18n()
  const active = useActiveSection(sectionIds)
  const headerRef = useRef<HTMLElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const { scrollY } = useScroll()
  const arrowOpacity = useTransform(scrollY, [0, 120], [1, 0])

  // Se o menu da barra não couber, ele rola na horizontal: centraliza o item ativo.
  useEffect(() => {
    const list = listRef.current
    const link = list?.querySelector<HTMLElement>('[aria-current]')
    if (!list || !link || list.scrollWidth <= list.clientWidth) return
    list.scrollTo({ left: link.offsetLeft - (list.clientWidth - link.offsetWidth) / 2, behavior: 'smooth' })
  }, [active])

  // Menu kebab aberto: fecha com Esc, com toque fora dele ou se a tela crescer até o desktop.
  useEffect(() => {
    if (!menuOpen) return
    const close = () => setMenuOpen(false)
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && close()
    const onPointer = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) close()
    }
    const desktop = matchMedia('(min-width: 1024px)')
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    desktop.addEventListener('change', close)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
      desktop.removeEventListener('change', close)
    }
  }, [menuOpen])

  return (
    <header ref={headerRef} className="sticky top-0 z-50 bg-nav dark:border-b dark:border-white/10">
      <div className="mx-auto flex h-[72px] w-full max-w-[1280px] items-center gap-3 px-4 lg:h-[81px] lg:gap-6 lg:px-[22px] xl:gap-[41px]">
        {/* Idioma e tema, à esquerda */}
        <motion.div {...enter(0)} className="flex shrink-0 items-center gap-[11px]">
          <LanguageSwitch />
          <ThemeToggle />
        </motion.div>

        <motion.nav
          {...enter(0.08)}
          aria-label={t.nav.label}
          className="hidden min-w-0 flex-1 rounded-full bg-nav p-2 lg:block xl:w-[808px] xl:flex-none"
        >
          <ul
            ref={listRef}
            className="relative flex items-center justify-between gap-1 overflow-x-auto [scrollbar-width:none]"
          >
            {sectionIds.map((id) => {
              const isActive = active === id
              return (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    aria-current={isActive ? 'true' : undefined}
                    className={cn(
                      'relative block rounded-full px-4 py-3 whitespace-nowrap type-nav transition-colors xl:px-6',
                      isActive ? 'text-white' : 'text-white/70 hover:text-white',
                      focusRing,
                    )}
                  >
                    {/* Linha azul sob a seção em que o usuário está; desliza entre os itens */}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-x-4 bottom-1 h-[3px] rounded-full bg-brand xl:inset-x-6"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                    {t.nav[id]}
                  </a>
                </li>
              )
            })}
          </ul>
        </motion.nav>

        {/* Botão kebab (celular e tablet) */}
        <motion.button
          {...enter(0.08)}
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="menu-mobile"
          aria-label={menuOpen ? t.controls.closeMenu : t.controls.openMenu}
          className={cn(
            'ml-auto flex size-11 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 lg:hidden',
            menuOpen && 'bg-white/10',
            focusRing,
          )}
        >
          <KebabIcon open={menuOpen} />
        </motion.button>

        {/* "Entre em contato" + seta desenhada (só no desktop; no celular o menu kebab já tem "Contato") */}
        <motion.div {...enter(0.16)} className="relative hidden shrink-0 lg:flex">
          <a
            href="#contato"
            className={`flex h-11 items-center rounded-full bg-brand px-6 type-nav font-medium whitespace-nowrap text-white shadow-[0_8px_24px_rgb(0_62_166/0.35)] transition-colors hover:bg-brand-strong ${focusRing}`}
          >
            {t.nav.cta}
          </a>
          {/* A seta some quando a página rola, para não ficar flutuando sobre o conteúdo */}
          <motion.div
            className="pointer-events-none absolute top-full left-1/2 mt-3 -translate-x-1/2 text-title"
            style={{ opacity: arrowOpacity }}
          >
            <CurlyArrow className="h-[103px] w-[69px] rotate-12" />
          </motion.div>
        </motion.div>
      </div>

      {/* Lista do menu kebab, abaixo da barra e alinhada ao botão */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="menu-mobile"
            aria-label={t.nav.label}
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.2, ease: EASE_OUT }}
            className="absolute top-full right-4 mt-2 w-[min(18rem,calc(100%-2rem))] origin-top-right rounded-[24px] bg-nav p-2 shadow-[0_16px_40px_rgb(0_0_0/0.35)] ring-1 ring-white/10 lg:hidden"
          >
            <ul className="flex flex-col gap-1">
              {sectionIds.map((id) => {
                const isActive = active === id
                return (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      onClick={() => setMenuOpen(false)}
                      aria-current={isActive ? 'true' : undefined}
                      className={cn(
                        'relative block rounded-full px-4 py-3 type-nav transition-colors',
                        // Mesmo sinal da barra do desktop: linha azul, aqui à esquerda do item.
                        isActive
                          ? 'text-white before:absolute before:inset-y-3 before:left-1 before:w-[3px] before:rounded-full before:bg-brand'
                          : 'text-white/70 hover:text-white',
                        focusRing,
                      )}
                    >
                      {t.nav[id]}
                    </a>
                  </li>
                )
              })}
            </ul>
            <a
              href="#contato"
              onClick={() => setMenuOpen(false)}
              className={`mt-2 flex h-11 items-center justify-center rounded-full bg-brand px-6 type-nav font-medium text-white transition-colors hover:bg-brand-strong ${focusRing}`}
            >
              {t.nav.cta}
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
