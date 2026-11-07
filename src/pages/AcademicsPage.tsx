import { ArrowRight, BookOpenCheck, CalendarDays, Clock3, GraduationCap, HeartHandshake, ImagePlus, MapPin, Phone, ShieldAlert, Sparkles, UserRound, UsersRound } from 'lucide-react'
import { AcademicHeroCarousel } from '../components/academics/AcademicHeroCarousel'
import { AdmissionForm } from '../components/academics/AdmissionForm'
import { Reveal } from '../components/common/Reveal'
import { SectionHeading } from '../components/common/SectionHeading'
import { academicCollege, academicCourses, academicFaculty, academicPillars } from '../data/academics'
import { useLanguage } from '../context/LanguageContext'
import { usePublishedMinistries } from '../hooks/usePublishedContent'

const pillarIcons = {
  scripture: BookOpenCheck,
  formation: Sparkles,
  ministry: HeartHandshake,
  leadership: UsersRound,
} as const

export function AcademicsPage() {
  const { t, localize } = useLanguage()
  const managedFaculty = usePublishedMinistries('academics').data ?? []
  const faculty = academicFaculty.map((member) => {
    const managed = managedFaculty.find((entry) => entry.slug === member.id)
    return {
      ...member,
      name: managed ? localize({ en: managed.title_en, ta: managed.title_ta }) : member.name,
      role: managed?.eyebrow_en && managed.eyebrow_ta
        ? { en: managed.eyebrow_en, ta: managed.eyebrow_ta }
        : member.role,
      qualification: managed && (managed.description_en || managed.description_ta)
        ? localize({ en: managed.description_en, ta: managed.description_ta })
        : member.qualification,
      imageUrl: managed?.image_url || member.imageUrl,
    }
  })

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

          <div className="academic-institute-grid">
            <Reveal className="academic-institute-card">
              <p className="academic-institute-card__eyebrow">{t('academics.institute.eyebrow')}</p>
              <h3>{academicCollege.name}</h3>
              <div className="academic-institute-facts">
                <div><span>{t('academics.institute.affiliation')}</span><strong>{academicCollege.affiliation}</strong></div>
                <div><span>{t('academics.institute.since')}</span><strong>{academicCollege.established}</strong></div>
                <div><span>{t('academics.institute.founder')}</span><strong>{academicCollege.founder}</strong></div>
                <div><span>{t('academics.institute.principal')}</span><strong>{academicCollege.principal}</strong></div>
              </div>
              <address><MapPin size={19} aria-hidden="true" /><span>{localize(academicCollege.address)}</span></address>
              <div className="academic-institute-phones">
                <Phone size={18} aria-hidden="true" />
                <span>{academicCollege.phones.map((phone, index) => <span key={phone.href}>{index > 0 && <i aria-hidden="true">/</i>}<a href={phone.href}>{phone.display}</a></span>)}</span>
              </div>
            </Reveal>

            <Reveal className="academic-admissions-callout" delay={0.08}>
              <span><CalendarDays size={27} aria-hidden="true" /></span>
              <p>{t('academics.admissions2027.eyebrow')}</p>
              <h3>{t('academics.admissions2027.title')}</h3>
              <strong>{t('academics.admissions2027.start')}</strong>
              <a className="button button--navy" href="#academics-admission">{t('academics.admissions2027.cta')} <ArrowRight size={17} aria-hidden="true" /></a>
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
          <div className="academic-courses">
            {academicCourses.map((course, index) => (
              <Reveal className="academic-course" key={course.id} delay={index * 0.06}>
                <div className="academic-course__top"><span><GraduationCap size={26} aria-hidden="true" /></span><small>{course.shortName}</small></div>
                <h3>{localize(course.title)}</h3>
                <p><Clock3 size={17} aria-hidden="true" /> <span>{t('academics.syllabus.duration')}</span><strong>{localize(course.duration)}</strong></p>
              </Reveal>
            ))}
          </div>
          <p className="academic-syllabus__note"><ShieldAlert size={18} aria-hidden="true" /> {t('academics.syllabus.note')}</p>
        </div>
      </section>

      <section id="academics-faculty" className="section section--ivory academic-faculty">
        <div className="container">
          <SectionHeading eyebrow={t('academics.faculty.eyebrow')} title={t('academics.faculty.title')} description={t('academics.faculty.intro')} />
          <div className="academic-faculty__grid">
            {faculty.map((member, index) => (
              <Reveal className={`academic-faculty-card${member.id === 'faculty-a-george-edward' ? ' is-principal' : ''}`} key={member.id} delay={(index % 3) * 0.05}>
                <div className="academic-faculty-card__media">
                  {member.imageUrl
                    ? <img src={member.imageUrl} alt={t('academics.faculty.photoAlt').replace('{name}', member.name)} loading="lazy" />
                    : <div><UserRound size={42} aria-hidden="true" /><span>{t('academics.faculty.photoPending')}</span></div>}
                </div>
                <div className="academic-faculty-card__copy">
                  <p>{localize(member.role)}</p>
                  <h3>{member.name}</h3>
                  {member.qualification && <span>{member.qualification}</span>}
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="academic-faculty__admin-note"><ImagePlus size={19} aria-hidden="true" /><p>{t('academics.faculty.photoNote')}</p></Reveal>
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

