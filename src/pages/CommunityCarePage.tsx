import { ArrowUpRight, Backpack, BookOpenCheck, HandHeart, Heart, Hospital, Phone, ShieldCheck, Stethoscope, TreePine, UsersRound } from 'lucide-react'
import { CommunityHeroCarousel } from '../components/community/CommunityHeroCarousel'
import { Reveal } from '../components/common/Reveal'
import { SectionHeading } from '../components/common/SectionHeading'
import { useLanguage } from '../context/LanguageContext'
import { churchInfo } from '../data/churchInfo'
import { compassionProgrammes, educationProgrammes, healthProgrammes, type CommunityCareIcon, type CommunityProgramme } from '../data/communityCare'
import { usePublishedMinistries } from '../hooks/usePublishedContent'

const programmeIcons: Record<CommunityCareIcon, typeof TreePine> = {
  tree: TreePine,
  heart: HandHeart,
  health: Stethoscope,
  family: UsersRound,
  widow: Heart,
  hospital: Hospital,
  camp: Stethoscope,
  tuition: BookOpenCheck,
  'school-kit': Backpack,
}

function ProgrammeCard({ programme, index, variant = 'light' }: { programme: CommunityProgramme; index: number; variant?: 'light' | 'dark' }) {
  const { localize } = useLanguage()
  const Icon = programmeIcons[programme.icon]
  return (
    <Reveal className={`care-programme-card care-programme-card--${variant}`} delay={index * 0.06}>
      <span className="care-programme-card__icon"><Icon size={27} aria-hidden="true" /></span>
      <div>
        <h3>{localize(programme.title)}</h3>
        <p>{localize(programme.description)}</p>
      </div>
    </Reveal>
  )
}

export function CommunityCarePage() {
  const { t } = useLanguage()
  const managedRows = usePublishedMinistries('community').data ?? []
  const managed = (items: CommunityProgramme[]) => items.map((item) => { const row = managedRows.find((entry) => entry.slug === item.id); return row ? { ...item, title: { en: row.title_en, ta: row.title_ta }, description: { en: row.description_en, ta: row.description_ta } } : item })
  const compassionContent = managed(compassionProgrammes)
  const healthContent = managed(healthProgrammes)
  const educationContent = managed(educationProgrammes)

  return (
    <main id="main-content" className="community-care-page" tabIndex={-1}>
      <CommunityHeroCarousel />

      <section id="care-environment" className="section care-environment">
        <div className="container care-environment__layout">
          <Reveal className="care-environment__statement">
            <p>{t('community.environment.vision')}</p>
            <strong>1</strong>
            <span>{t('community.environment.crore')}</span>
            <small>{t('community.environment.trees')}</small>
          </Reveal>
          <Reveal className="care-environment__copy" delay={0.08}>
            <SectionHeading eyebrow={t('community.environment.eyebrow')} title={t('community.environment.title')} />
            <p>{t('community.environment.body')}</p>
            <div className="care-environment__principles">
              <span><TreePine size={20} aria-hidden="true" /> {t('community.environment.principle1')}</span>
              <span><UsersRound size={20} aria-hidden="true" /> {t('community.environment.principle2')}</span>
              <span><ShieldCheck size={20} aria-hidden="true" /> {t('community.environment.principle3')}</span>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="care-compassion" className="section section--ivory care-programmes">
        <div className="container">
          <SectionHeading eyebrow={t('community.compassion.eyebrow')} title={t('community.compassion.title')} description={t('community.compassion.intro')} />
          <div className="care-programmes__grid care-programmes__grid--two">
            {compassionContent.map((programme, index) => <ProgrammeCard key={programme.id} programme={programme} index={index} />)}
          </div>
        </div>
      </section>

      <section id="care-health" className="section care-health care-programmes">
        <div className="container">
          <SectionHeading eyebrow={t('community.health.eyebrow')} title={t('community.health.title')} description={t('community.health.intro')} />
          <div className="care-programmes__grid care-programmes__grid--two">
            {healthContent.map((programme, index) => <ProgrammeCard key={programme.id} programme={programme} index={index} variant="dark" />)}
          </div>
          <p className="care-health__note"><ShieldCheck size={18} aria-hidden="true" /> {t('community.health.note')}</p>
        </div>
      </section>

      <section id="care-education" className="section section--sand care-programmes care-education">
        <div className="container">
          <SectionHeading eyebrow={t('community.education.eyebrow')} title={t('community.education.title')} description={t('community.education.intro')} />
          <div className="care-programmes__grid care-programmes__grid--two">
            {educationContent.map((programme, index) => <ProgrammeCard key={programme.id} programme={programme} index={index} />)}
          </div>
          <Reveal className="care-contact-cta">
            <div><HandHeart size={27} aria-hidden="true" /><span><strong>{t('community.cta.title')}</strong><small>{t('community.cta.body')}</small></span></div>
            <a className="button button--navy" href={`tel:${churchInfo.phone}`}><Phone size={18} aria-hidden="true" /> {t('community.cta.button')} <ArrowUpRight size={16} aria-hidden="true" /></a>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
