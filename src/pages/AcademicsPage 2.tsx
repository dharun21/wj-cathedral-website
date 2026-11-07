import { BookOpenCheck, HeartHandshake, ImagePlus, Landmark, ShieldAlert, Sparkles, UsersRound } from 'lucide-react'
import { AcademicHeroCarousel } from '../components/academics/AcademicHeroCarousel'
import { AdmissionForm } from '../components/academics/AdmissionForm'
import { Reveal } from '../components/common/Reveal'
import { SectionHeading } from '../components/common/SectionHeading'
import { academicModules, academicPillars } from '../data/academics'
import { useLanguage } from '../context/LanguageContext'

const pillarIcons = {
  scripture: BookOpenCheck,
  formation: Sparkles,
  ministry: HeartHandshake,
  leadership: UsersRound,
} as const

export function AcademicsPage() {
  const { t, localize } = useLanguage()

  return (
    <main id="main-content" className="academics-page" tabIndex={-1}>
      <AcademicHeroCarousel />

      <section id="academics-about" className="section section--ivory academic-about">
        <div className="container">
          <div className="academic-about__intro">
            <Reveal>
              <SectionHeading eyebrow={t('academics.about.eyebrow')} title={t('academics.about.title')} />
            </Reveal>
            <Reveal className="academic-about__copy" delay={0.08}>
              <p>{t('academics.about.body1')}</p>
              <p>{t('academics.about.body2')}</p>
            </Reveal>
          </div>

          <div className="academic-pillars">
            {academicPillars.map((pillar, index) => {
              const Icon = pillarIcons[pillar.id]
              return (
                <Reveal className="academic-pillar" key={pillar.id} delay={index * 0.05}>
                  <span><Icon size={24} aria-hidden="true" /></span>
                  <h3>{localize(pillar.title)}</h3>
                  <p>{localize(pillar.description)}</p>
                </Reveal>
              )
            })}
          </div>

          <Reveal className="academic-approval-note">
            <ShieldAlert size={22} aria-hidden="true" />
            <div><strong>{t('academics.about.noteLabel')}</strong><p>{t('academics.about.note')}</p></div>
          </Reveal>
        </div>
      </section>

      <section id="academics-syllabus" className="section section--sand academic-syllabus">
        <div className="container">
          <SectionHeading eyebrow={t('academics.syllabus.eyebrow')} title={t('academics.syllabus.title')} description={t('academics.syllabus.intro')} />
          <div className="academic-modules">
            {academicModules.map((module, index) => (
              <Reveal className="academic-module" key={module.id} delay={(index % 3) * 0.06}>
                <span className="academic-module__number">{module.number}</span>
                <div><h3>{localize(module.title)}</h3><p>{localize(module.description)}</p></div>
              </Reveal>
            ))}
          </div>
          <p className="academic-syllabus__note"><Landmark size={18} aria-hidden="true" /> {t('academics.syllabus.note')}</p>
        </div>
      </section>

      <AdmissionForm />

      <section id="academics-graduation" className="section section--ivory academic-graduation">
        <div className="container">
          <SectionHeading eyebrow={t('academics.graduation.eyebrow')} title={t('academics.graduation.title')} description={t('academics.graduation.intro')} />
          <div className="academic-graduation__grid">
            {[1, 2, 3].map((number, index) => (
              <Reveal className="academic-graduation__placeholder" key={number} delay={index * 0.06}>
                <div aria-hidden="true"><span /><ImagePlus size={35} /></div>
                <p><strong>{t('academics.graduation.photo')} {String(number).padStart(2, '0')}</strong><small>{t('academics.graduation.pending')}</small></p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

