import { motion, type Variants } from 'motion/react'
import cambridgeResult from '../../assets/cambridge-resultado.pdf'
import cambridgePhoto from '../../assets/cambridge.jpg'
import arrowUpRight from '../../assets/icon-arrow-up-right.svg'
import iconLanguage from '../../assets/icon-language.svg'
import ufmsCampus from '../../assets/ufms-campus.jpg'
import { cefrLevels, education, englishLevel } from '../../data/content'
import { useI18n } from '../../i18n/context'
import { cn } from '../../lib/cn'
import { EASE_OUT, fadeUp, inView, pop, staggered } from '../../lib/motion'
import { Container } from '../ui/Container'
import { Reveal } from '../ui/Reveal'

const years = Array.from({ length: education.endYear - education.startYear + 1 }, (_, i) => education.startYear + i)
// Índice do ano em que estou hoje; a linha do tempo avança sozinha a cada ano.
const nowIndex = Math.min(Math.max(new Date().getFullYear() - education.startYear, 0), years.length - 1)
const englishIndex = cefrLevels.indexOf(englishLevel)

/** Trilho que se preenche até `custom` (0 a 1) quando o cartão entra na tela. */
const grow: Variants = {
  hidden: { scaleX: 0 },
  show: (to: number) => ({ scaleX: to, transition: { duration: 1.1, ease: EASE_OUT, delay: 0.5 } }),
}
/** Segmento da escala CEFR, um depois do outro. */
const fill: Variants = {
  hidden: { scaleX: 0 },
  show: (index: number) => ({ scaleX: 1, transition: { duration: 0.5, ease: EASE_OUT, delay: 0.5 + index * 0.1 } }),
}

function Badge({ children, className }: { children: string; className?: string }) {
  return (
    <span className={cn('inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 type-caption', className)}>
      {children}
    </span>
  )
}

export function Education() {
  const { t } = useI18n()
  const e = t.education

  return (
    <section id="educacao" className="bg-page pt-8 pb-16 lg:pt-12 lg:pb-24">
      <Container className="flex flex-col items-center gap-12 lg:gap-16">
        <Reveal>
          <h2 className="text-center type-h1 text-heading">{e.title}</h2>
        </Reveal>

        <div className="grid w-full max-w-[1056px] gap-6 lg:grid-cols-[1.55fr_1fr]">
          {/* Graduação: cartão azul-marinho em destaque, com a linha do tempo do curso */}
          <motion.article
            {...inView}
            variants={staggered(0.1)}
            className="relative isolate flex flex-col gap-10 overflow-hidden rounded-lg bg-inverse p-8 text-white shadow-[0_24px_64px_rgba(5,26,64,0.18)] md:p-10 dark:ring-1 dark:ring-white/5"
          >
            {/* Foto do letreiro "Sou UFMS" ao fundo, com degradê azul: escuro onde fica o texto, mais aberto à direita. */}
            <motion.img
              src={ufmsCampus}
              alt=""
              aria-hidden="true"
              loading="lazy"
              initial={{ scale: 1.12 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, ease: EASE_OUT }}
              // Foto mais alta que o cartão e puxada para cima: o letreiro fica no meio, acima da linha do tempo.
              className="absolute -top-[38%] right-0 -z-20 h-[138%] w-[78%] object-cover object-[62%_center]"
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-gradient-to-r from-inverse from-25% via-inverse/75 via-50% to-brand/20"
            />
            <span aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-inverse from-5% via-inverse/40 via-30% to-transparent to-60%" />

            <motion.p variants={fadeUp} className="type-caption text-white/60">
              {e.progress(nowIndex + 1, years.length)}
            </motion.p>

            <div className="flex flex-col gap-3">
              <motion.p variants={fadeUp} className="type-overline text-[#9db8ff]">
                UFMS
              </motion.p>
              <motion.h3 variants={fadeUp} className="type-h2 text-white">
                {e.degree}
              </motion.h3>
              <motion.p variants={fadeUp} className="type-body-lg text-white/70">
                {e.institution}
              </motion.p>
            </div>

            {/* Linha do tempo: um marco por ano; o trilho cresce até o ano atual, que pulsa. */}
            <motion.div variants={fadeUp} className="relative mx-2 mt-auto h-20">
              <span className="absolute inset-x-0 top-[7px] h-0.5 rounded-full bg-white/15" />
              <motion.span
                variants={grow}
                custom={nowIndex / (years.length - 1)}
                className="absolute inset-x-0 top-[7px] h-0.5 origin-left rounded-full bg-[#9db8ff]"
              />
              {years.map((year, index) => {
                const done = index <= nowIndex
                const isNow = index === nowIndex
                const label = isNow ? e.now : index === 0 ? e.start : index === years.length - 1 ? e.graduation : ''
                return (
                  <motion.div
                    key={year}
                    variants={pop}
                    style={{ left: `${(index / (years.length - 1)) * 100}%` }}
                    className="absolute top-0 flex -translate-x-1/2 flex-col items-center gap-2"
                  >
                    <span className="relative flex size-4 items-center justify-center">
                      {isNow && <span className="absolute size-full animate-ping rounded-full bg-[#9db8ff] opacity-60" />}
                      <span
                        className={cn(
                          'relative size-4 rounded-full border-2',
                          done ? 'border-[#9db8ff] bg-[#9db8ff]' : 'border-white/30 bg-inverse',
                        )}
                      />
                    </span>
                    <span className={cn('type-body-md font-semibold', done ? 'text-white' : 'text-white/50')}>
                      {year}
                    </span>
                    <span className={cn('type-caption whitespace-nowrap', isNow ? 'text-[#9db8ff]' : 'text-white/50')}>
                      {label}
                    </span>
                  </motion.div>
                )
              })}
            </motion.div>
          </motion.article>

          {/*
            Inglês: mesmo visual do cartão da UFMS, com a foto de Cambridge ao fundo.
            O cartão inteiro abre o PDF do resultado (link "esticado" pelo after:inset-0).
          */}
          <motion.article
            {...inView}
            variants={staggered(0.1, 0.15)}
            className="group relative isolate flex flex-col gap-6 overflow-hidden rounded-lg bg-inverse p-8 text-white shadow-[0_24px_64px_rgba(5,26,64,0.18)] md:p-10 dark:ring-1 dark:ring-white/5"
          >
            {/* A moldura dá o zoom no hover; a foto dentro faz a entrada (as duas animam transform). */}
            <span aria-hidden="true" className="absolute inset-0 -z-20 transition-transform duration-700 ease-out group-hover:scale-105">
              <motion.img
                src={cambridgePhoto}
                alt=""
                loading="lazy"
                initial={{ scale: 1.12 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.6, ease: EASE_OUT }}
                className="size-full object-cover object-[50%_30%]"
              />
            </span>
            {/* Prédio visível no alto; embaixo, onde ficam os textos, o azul fecha. */}
            <span
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-gradient-to-t from-inverse from-40% via-inverse/85 via-65% to-inverse/35"
            />

            <motion.div variants={fadeUp} className="flex items-center justify-between gap-3">
              <span className="flex size-12 items-center justify-center rounded-md bg-white/10 ring-1 ring-white/15">
                <img src={iconLanguage} alt="" className="size-6 brightness-0 invert" />
              </span>
              <Badge className="bg-white/10 text-white/90 ring-1 ring-white/15">{e.language.status}</Badge>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-auto flex items-end gap-4">
              <span className="bg-gradient-to-br from-white to-[#9db8ff] bg-clip-text text-[88px] leading-none font-bold tracking-tight text-transparent">
                {englishLevel}
              </span>
              <span className="pb-2 type-h3 text-white">{e.language.title}</span>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-col gap-1">
              <p className="type-body-lg text-white/85">{e.language.exam}</p>
              <p className="type-body-md text-white/60">{e.language.result}</p>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-col gap-2" aria-label={e.language.scale}>
              <div className="flex gap-1.5" aria-hidden="true">
                {cefrLevels.map((level, index) => (
                  <span key={level} className="h-2 flex-1 overflow-hidden rounded-full bg-white/15">
                    {index <= englishIndex && (
                      <motion.span variants={fill} custom={index} className="block h-full origin-left rounded-full bg-[#9db8ff]" />
                    )}
                  </span>
                ))}
              </div>
              <div className="flex justify-between type-caption" aria-hidden="true">
                {cefrLevels.map((level, index) => (
                  <span key={level} className={index === englishIndex ? 'font-semibold text-[#9db8ff]' : 'text-white/50'}>
                    {level}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.a
              variants={fadeUp}
              href={cambridgeResult}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-fit items-center gap-2 type-button text-white after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-white focus-visible:after:ring-inset"
            >
              {e.language.certificate}
              <img src={arrowUpRight} alt="" className="size-3 transition-transform duration-300 group-hover:rotate-45" />
            </motion.a>
          </motion.article>
        </div>
      </Container>
    </section>
  )
}
