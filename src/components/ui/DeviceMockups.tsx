import { motion } from 'motion/react'
import notebookBezel from '../../assets/mockups/device-notebook.png'
import phoneBezel from '../../assets/mockups/device-phone.png'
import tabletBezel from '../../assets/mockups/device-tablet.png'
import { cn } from '../../lib/cn'
import { fadeUp } from '../../lib/motion'

/*
 * Mockups de notebook, tablet e celular (molduras exportadas do Figma, "Projetos — componentes").
 * As posições da tela são porcentagens da moldura, medidas no Figma.
 */

/** `mobileAlt`: segunda tela de celular, para projetos só de app (dois celulares lado a lado). */
export type DeviceScreens = { desktop?: string; tablet?: string; mobile?: string; mobileAlt?: string }

type DeviceProps = { src: string; alt: string; className?: string }

const screenClass = 'absolute size-full object-cover object-top'

/** A moldura do notebook é opaca: a tela vai por cima, com o entalhe da câmera desenhado depois. */
function Notebook({ src, alt, className }: DeviceProps) {
  return (
    <div className={cn('relative aspect-[636/376]', className)}>
      <img src={notebookBezel} alt="" className="absolute inset-0 size-full" />
      <div className="absolute top-[2.2%] left-[8.96%] h-[91.14%] w-[82.07%] overflow-hidden rounded-[0.3%]">
        <img src={src} alt={alt} loading="lazy" className={screenClass} />
      </div>
      <span className="absolute top-[0.55%] left-[42.65%] h-[3.3%] w-[14.65%] rounded-b-[6px] bg-black" />
    </div>
  )
}

/** Tablet e celular têm a tela transparente na moldura: a imagem fica embaixo. */
function Tablet({ src, alt, className }: DeviceProps) {
  return (
    <div className={cn('relative aspect-[322/416]', className)}>
      <div className="absolute top-[3.85%] left-[5.28%] h-[92.31%] w-[89.44%] overflow-hidden bg-white">
        <img src={src} alt={alt} loading="lazy" className={screenClass} />
      </div>
      <img src={tabletBezel} alt="" className="pointer-events-none absolute inset-0 size-full" />
    </div>
  )
}

function Phone({ src, alt, className }: DeviceProps) {
  return (
    <div className={cn('relative aspect-[139/268]', className)}>
      <div className="absolute top-[2.99%] left-[7.91%] h-[93.66%] w-[83.45%] overflow-hidden rounded-[14%/6.5%] bg-white">
        <img src={src} alt={alt} loading="lazy" className={screenClass} />
      </div>
      <img src={phoneBezel} alt="" className="pointer-events-none absolute inset-0 size-full" />
    </div>
  )
}

type DeviceShowcaseProps = {
  screens: DeviceScreens
  alt: string
  className?: string
}

const shadow = 'drop-shadow-[0_24px_32px_rgb(0_0_0/0.35)]'

/**
 * Composição dos aparelhos que o projeto tiver:
 * notebook + tablet + celular, tablet + celular, dois celulares (app) ou só o notebook (software).
 * Os aparelhos entram um de cada vez (variantes `fadeUp` do container pai).
 */
export function DeviceShowcase({ screens, alt, className }: DeviceShowcaseProps) {
  const { desktop, tablet, mobile, mobileAlt } = screens

  // Dois celulares: o primeiro mais alto, o segundo um pouco abaixo e à frente.
  if (mobile && mobileAlt && !desktop && !tablet) {
    return (
      <div className={cn('relative aspect-[5/4]', className)}>
        <motion.div variants={fadeUp} className={cn('absolute top-0 left-[13%] w-[37%]', shadow)}>
          <Phone src={mobile} alt={alt} />
        </motion.div>
        <motion.div variants={fadeUp} className={cn('absolute right-[11%] bottom-0 w-[37%]', shadow)}>
          <Phone src={mobileAlt} alt={alt} />
        </motion.div>
      </div>
    )
  }

  if (desktop && !tablet && !mobile) {
    return (
      <motion.div variants={fadeUp} className={cn(shadow, className)}>
        <Notebook src={desktop} alt={alt} />
      </motion.div>
    )
  }

  if (!desktop) {
    return (
      <div className={cn('relative aspect-[5/4]', className)}>
        {tablet && (
          <motion.div variants={fadeUp} className={cn('absolute top-0 left-[8%] w-[58%]', shadow)}>
            <Tablet src={tablet} alt={alt} />
          </motion.div>
        )}
        {mobile && (
          <motion.div variants={fadeUp} className={cn('absolute right-[4%] bottom-0 w-[28%]', shadow)}>
            <Phone src={mobile} alt={alt} />
          </motion.div>
        )}
      </div>
    )
  }

  return (
    <div className={cn('relative aspect-[16/10]', className)}>
      <motion.div variants={fadeUp} className={cn('absolute top-0 left-0 w-[78%]', shadow)}>
        <Notebook src={desktop} alt={alt} />
      </motion.div>
      {tablet && (
        <motion.div variants={fadeUp} className={cn('absolute right-[10%] bottom-0 w-[24%]', shadow)}>
          <Tablet src={tablet} alt={alt} />
        </motion.div>
      )}
      {mobile && (
        <motion.div variants={fadeUp} className={cn('absolute right-0 bottom-0 w-[11.5%]', shadow)}>
          <Phone src={mobile} alt={alt} />
        </motion.div>
      )}
    </div>
  )
}
