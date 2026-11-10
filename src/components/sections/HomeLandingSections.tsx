import {
  ArrowRight,
  ArrowUpRight,
  BookOpenText,
  CalendarDays,
  Church,
  Clock3,
  GraduationCap,
  HandHeart,
  HeartHandshake,
  Leaf,
  MapPin,
  Phone,
  School,
  Sparkles,
  Stethoscope,
  Trees,
  UsersRound,
} from 'lucide-react'
import { academicCollege, academicCourses } from '../../data/academics'
import { churchInfo } from '../../data/churchInfo'
import { generationMinistries } from '../../data/churchMinistries'
import { recurringGatherings } from '../../data/recurringGatherings'
import { useLanguage } from '../../context/LanguageContext'
import { usePublishedAcademicCourses, usePublishedAcademicSettings, usePublishedMinistries, usePublishedSiteSettings, usePublishedWorship } from '../../hooks/usePublishedContent'
import { Reveal } from '../common/Reveal'
import { SectionHeading } from '../common/SectionHeading'

const ministryImages: Record<string, string> = {
  'children-ministry': './church/children-ministry.jpg',
  'youth-ministry': './home/youth-ministry.jpg',
  'family-counselling': './church/family-counselling.jpg',
}

const ministryIcons = [UsersRound, Sparkles, HeartHandshake] as const

export function HomeWelcomeStory() {
  const { localize } = useLanguage()
  return (
    <section id="home-welcome" className="section home-story">
      <div className="container home-story__layout">
        <Reveal className="home-story__media">
          <img src="./home/church-family-worship.jpg" alt={localize({ en: 'The WJ Cathedral church family gathered for worship in Nannilam', ta: 'நன்னிலத்தில் ஆராதனைக்காக ஒன்றுகூடிய WJ Cathedral திருச்சபைக் குடும்பம்' })} />
          <div className="home-story__location"><MapPin size={17} aria-hidden="true" /><span>{localize(churchInfo.locationShort)}</span></div>
          <div className="home-story__seal"><Church size={25} aria-hidden="true" /><span>{localize({ en: 'Jesus at the centre', ta: 'மையத்தில் இயேசு' })}</span></div>
        </Reveal>
        <Reveal className="home-story__copy" delay={0.08}>
          <p className="home-kicker">{localize({ en: 'Welcome to our church family', ta: 'எங்கள் திருச்சபைக் குடும்பத்திற்கு வரவேற்கிறோம்' })}</p>
          <h2>{localize({ en: 'A place to worship, grow and serve together.', ta: 'ஒன்றாக ஆராதிக்கவும், வளரவும், சேவை செய்யவும் ஓர் இடம்.' })}</h2>
          <p>{localize({
            en: 'Worship to Jesus Cathedral is a Christian worshipping community in Nannilam, welcoming families, neighbours and first-time visitors into a life of prayer, biblical formation and compassionate service.',
            ta: 'Worship to Jesus Cathedral நன்னிலத்தில் உள்ள ஒரு கிறிஸ்தவ ஆராதனைச் சமூகமாகும். குடும்பங்கள், அயலார்கள் மற்றும் முதன்முறை வருகையாளர்களை ஜெபம், வேதாகம உருவாக்கம் மற்றும் இரக்கமுள்ள சேவையின் வாழ்க்கைக்குள் அன்புடன் வரவேற்கிறது.',
          })}</p>
          <div className="home-story__values">
            <span><Sparkles size={18} />{localize({ en: 'Worship', ta: 'ஆராதனை' })}</span>
            <span><BookOpenText size={18} />{localize({ en: 'God’s Word', ta: 'தேவ வார்த்தை' })}</span>
            <span><HandHeart size={18} />{localize({ en: 'Compassionate service', ta: 'இரக்கமுள்ள சேவை' })}</span>
          </div>
          <div className="home-actions">
            <a className="button button--navy" href="#about">{localize({ en: 'Discover our story', ta: 'எங்கள் பயணத்தை அறியுங்கள்' })} <ArrowRight size={17} /></a>
            <a className="text-link" href={churchInfo.mapsUrl} target="_blank" rel="noreferrer">{localize({ en: 'Find us in Nannilam', ta: 'நன்னிலத்தில் எங்களைக் கண்டறியுங்கள்' })} <ArrowUpRight size={16} /></a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function HomeMinistryPathways() {
  const { localize } = useLanguage()
  const managedRows = usePublishedMinistries('church').data ?? []
  const knownIds = new Set(generationMinistries.map((ministry) => ministry.id))
  const ministryCards = [
    ...generationMinistries.map((ministry) => {
      const managed = managedRows.find((row) => row.slug === ministry.id)
      return {
        id: ministry.id,
        eyebrow: managed ? { en: managed.eyebrow_en || ministry.eyebrow.en, ta: managed.eyebrow_ta || ministry.eyebrow.ta } : ministry.eyebrow,
        title: managed ? { en: managed.title_en, ta: managed.title_ta } : ministry.title,
        description: managed ? { en: managed.description_en, ta: managed.description_ta } : ministry.description,
        imageUrl: ministry.id === 'youth-ministry' ? ministryImages[ministry.id] : managed?.image_url || ministryImages[ministry.id],
      }
    }),
    ...managedRows.filter((row) => !knownIds.has(row.slug as (typeof generationMinistries)[number]['id'])).map((row) => ({
      id: row.slug,
      eyebrow: { en: row.eyebrow_en || 'Church ministry', ta: row.eyebrow_ta || 'திருச்சபை ஊழியம்' },
      title: { en: row.title_en, ta: row.title_ta },
      description: { en: row.description_en, ta: row.description_ta },
      imageUrl: row.image_url || './church/gospel-ministries.jpg',
    })),
  ]
  return (
    <section className="section home-ministries">
      <div className="container">
        <div className="home-section-intro">
          <SectionHeading
            eyebrow={localize({ en: 'A church for every generation', ta: 'ஒவ்வொரு தலைமுறைக்குமான திருச்சபை' })}
            title={localize({ en: 'Belong. Grow. Walk in purpose.', ta: 'இணைந்திடுங்கள். வளருங்கள். நோக்கத்துடன் நடங்கள்.' })}
            description={localize({ en: 'From childhood to family life and mature leadership, our ministries help people grow in Christ and serve with love.', ta: 'சிறுவயது முதல் குடும்ப வாழ்க்கை மற்றும் முதிர்ந்த தலைமைத்துவம் வரை, கிறிஸ்துவில் வளரவும் அன்புடன் சேவை செய்யவும் எங்கள் ஊழியங்கள் உதவுகின்றன.' })}
          />
          <a className="home-heading-link" href="#church">{localize({ en: 'Explore every ministry', ta: 'அனைத்து ஊழியங்களையும் அறியுங்கள்' })} <ArrowRight size={17} /></a>
        </div>
        <div className="home-ministry-grid">
          {ministryCards.map((ministry, index) => {
            const Icon = ministryIcons[index] ?? Church
            return (
              <Reveal className="home-ministry-card" key={ministry.id} delay={index * 0.06}>
                <img
                  src={ministry.imageUrl}
                  alt={localize(ministry.title)}
                  loading="lazy"
                />
                <span className="home-ministry-card__shade" />
                <div className="home-ministry-card__number">0{index + 1}</div>
                <div className="home-ministry-card__copy">
                  <Icon size={22} aria-hidden="true" />
                  <p>{localize(ministry.eyebrow)}</p>
                  <h3>{localize(ministry.title)}</h3>
                  <span>{localize(ministry.description)}</span>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function HomeWorshipSchedule() {
  const { localize } = useLanguage()
  const published = usePublishedWorship(recurringGatherings)
  const services = published.data.length ? published.data : recurringGatherings
  return (
    <section id="worship" className="section home-schedule">
      <div className="container home-schedule__layout">
        <Reveal className="home-schedule__heading">
          <p className="home-kicker">{localize({ en: 'Cathedral worship & prayer', ta: 'பேராலய ஆராதனை மற்றும் ஜெபம்' })}</p>
          <h2>{localize({ en: 'Make room for worship throughout the week.', ta: 'வாரம் முழுவதும் ஆராதனைக்கு இடமளியுங்கள்.' })}</h2>
          <p>{localize({ en: 'Join the cathedral family for regular worship and prayer. Monthly gatherings without a fixed clock time are clearly marked for confirmation.', ta: 'வழக்கமான ஆராதனை மற்றும் ஜெபத்திற்காக திருச்சபைக் குடும்பத்துடன் இணையுங்கள். நிரந்தர நேரம் இல்லாத மாதாந்திர கூடுகைகள் உறுதிப்படுத்தப்பட வேண்டியதாகத் தெளிவாகக் குறிக்கப்பட்டுள்ளன.' })}</p>
          <a className="button button--gold" href="#events">{localize({ en: 'View the complete schedule', ta: 'முழு அட்டவணையைப் பாருங்கள்' })} <ArrowRight size={17} /></a>
        </Reveal>
        <div className="home-schedule__list">
          {services.slice(0, 4).map((service, index) => (
            <Reveal className="home-schedule-row" key={service.id} delay={index * 0.05}>
              <span className="home-schedule-row__number">0{index + 1}</span>
              <div><h3>{localize(service.name)}</h3><p><CalendarDays size={15} />{localize(service.day)}</p></div>
              <strong><Clock3 size={16} />{localize(service.time)}</strong>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function HomePrayerSupport() {
  const { localize } = useLanguage()
  const settings = usePublishedSiteSettings().data
  const phone = settings?.phone || churchInfo.phone
  const contacts = [
    { ...churchInfo.contacts[0], phone, display: phone === churchInfo.phone ? churchInfo.contacts[0].display : phone },
    churchInfo.contacts[1],
  ]
  const availability = { en: '24/7 prayer support', ta: '24/7 ஜெப உதவி' }
  return (
    <section className="home-prayer-band">
      <div className="container home-prayer-band__layout">
        <Reveal className="home-prayer-band__copy">
          <span><HeartHandshake size={22} />{localize(availability)}</span>
          <h2>{localize({ en: 'You do not have to carry every burden alone.', ta: 'ஒவ்வொரு பாரத்தையும் நீங்கள் தனியாகச் சுமக்க வேண்டியதில்லை.' })}</h2>
          <p>{localize({ en: 'For prayer, encouragement and pastoral support, connect directly with the WJ Cathedral prayer team.', ta: 'ஜெபம், ஊக்கம் மற்றும் மேய்ப்புப் பராமரிப்பிற்காக WJ Cathedral ஜெபக் குழுவை நேரடியாகத் தொடர்புகொள்ளுங்கள்.' })}</p>
        </Reveal>
        <Reveal className="home-prayer-band__action" delay={0.08}>
          <small>{localize({ en: 'Prayer contact', ta: 'ஜெபத் தொடர்பு' })}</small>
          <div className="home-prayer-band__phones">{contacts.map((contact) => <a href={`tel:${contact.phone}`} key={contact.id}><small>{contact.name}</small><strong>{contact.display}</strong></a>)}</div>
          <div><a className="button button--gold" href={`tel:${phone}`}><Phone size={18} />{localize({ en: 'Call for prayer', ta: 'ஜெபத்திற்கு அழைக்கவும்' })}</a><a className="button button--outline-light" href="#prayer-helpline">{localize({ en: 'Prayer support', ta: 'ஜெப உதவி' })}</a></div>
        </Reveal>
      </div>
    </section>
  )
}

export function HomeAcademicsFeature() {
  const { localize } = useLanguage()
  const managedSettings = usePublishedAcademicSettings().data
  const managedCourses = usePublishedAcademicCourses().data ?? []
  const courses = managedCourses.length ? managedCourses.map((course) => ({ id: course.slug, shortName: course.short_name, title: { en: course.title_en, ta: course.title_ta }, duration: { en: course.duration_en, ta: course.duration_ta } })) : academicCourses
  const collegeName = managedSettings?.college_name ?? academicCollege.name
  const affiliation = managedSettings?.affiliation ?? academicCollege.affiliation
  const admissionsOpen = managedSettings?.admissions_open ?? true
  return (
    <section className="section home-academics">
      <div className="container home-academics__layout">
        <Reveal className="home-academics__copy">
          <p className="home-kicker"><GraduationCap size={17} />{localize(admissionsOpen ? { en: 'Bible college · Admissions 2027', ta: 'வேதாகமக் கல்லூரி · 2027 சேர்க்கை' } : { en: 'Bible college', ta: 'வேதாகமக் கல்லூரி' })}</p>
          <h2>{localize({ en: 'Prepared in God’s Word. Equipped for faithful service.', ta: 'தேவ வார்த்தையில் ஆயத்தம். உண்மையுள்ள ஊழியத்திற்கு பயிற்சி.' })}</h2>
          <p>{localize(admissionsOpen ? { en: `${collegeName} welcomes applications for classes beginning in January 2027.`, ta: `${collegeName} ஜனவரி 2027-ல் தொடங்கும் வகுப்புகளுக்கான விண்ணப்பங்களை வரவேற்கிறது.` } : { en: `${collegeName} provides church-rooted theological and ministry education.`, ta: `${collegeName} திருச்சபை சார்ந்த இறையியல் மற்றும் ஊழியக் கல்வியை வழங்குகிறது.` })}</p>
          <div className="home-course-list">
            {courses.map((course) => <span key={course.id}><b>{course.shortName}</b><small>{localize(course.title)} · {localize(course.duration)}</small></span>)}
          </div>
          <div className="home-actions">{admissionsOpen && <a className="button button--navy" href="#academics-admission">{localize({ en: 'Apply for admission', ta: 'சேர்க்கைக்கு விண்ணப்பிக்கவும்' })} <ArrowRight size={17} /></a>}<a className="text-link" href="#academics">{localize({ en: 'Explore the college', ta: 'கல்லூரியை அறியுங்கள்' })} <ArrowUpRight size={16} /></a></div>
        </Reveal>
        <Reveal className="home-academics__media" delay={0.08}>
          <img src="./home/academics-graduates.jpg" alt={localize({ en: 'Graduates of Worship To Jesus Bible Institute & College', ta: 'Worship To Jesus Bible Institute & College பட்டதாரிகள்' })} loading="lazy" />
          <div><School size={23} /><span><small>{localize({ en: 'Affiliated by', ta: 'இணைப்பு' })}</small><strong>{affiliation}</strong></span></div>
        </Reveal>
      </div>
    </section>
  )
}

export function HomeCommunityCare() {
  const { localize } = useLanguage()
  const careItems = [
    { icon: HeartHandshake, en: 'Family & widow care', ta: 'குடும்பம் மற்றும் விதவை பராமரிப்பு' },
    { icon: Stethoscope, en: 'Hospital help & medical camps', ta: 'மருத்துவமனை உதவி மற்றும் மருத்துவ முகாம்கள்' },
    { icon: School, en: 'Free tuition & school essentials', ta: 'இலவச பயிற்சி மற்றும் பள்ளி உபகரணங்கள்' },
  ]
  return (
    <section className="section home-care">
      <div className="container home-care__layout">
        <Reveal className="home-care__mission">
          <Trees size={38} aria-hidden="true" />
          <strong>1</strong><span>{localize({ en: 'Crore trees', ta: 'கோடி மரங்கள்' })}</span>
          <p>{localize({ en: 'A long-term creation-care vision for greener communities and future generations.', ta: 'பசுமையான சமூகங்களுக்கும் வருங்காலத் தலைமுறைகளுக்கும் நீண்டகால படைப்புப் பராமரிப்பு தரிசனம்.' })}</p>
          <Leaf className="home-care__leaf" aria-hidden="true" />
        </Reveal>
        <Reveal className="home-care__copy" delay={0.08}>
          <p className="home-kicker">{localize({ en: 'Community Care', ta: 'சமூக அக்கறை' })}</p>
          <h2>{localize({ en: 'Faith made visible through practical compassion.', ta: 'நடைமுறை இரக்கத்தின் மூலம் வெளிப்படும் விசுவாசம்.' })}</h2>
          <p>{localize({ en: 'We seek to stand beside people, strengthen neighbourhoods and care for God’s creation through responsible, practical service.', ta: 'பொறுப்பான நடைமுறைச் சேவையின் மூலம் மக்களின் அருகில் நிற்கவும், சமூகங்களை வலுப்படுத்தவும், தேவனுடைய படைப்பைப் பேணவும் நாங்கள் விரும்புகிறோம்.' })}</p>
          <div className="home-care__items">
            {careItems.map((item) => { const Icon = item.icon; return <span key={item.en}><Icon size={19} /><b>{localize({ en: item.en, ta: item.ta })}</b></span> })}
          </div>
          <a className="button button--gold" href="#community-care">{localize({ en: 'Discover Community Care', ta: 'சமூக அக்கறைப் பணிகளை அறியுங்கள்' })} <ArrowRight size={17} /></a>
        </Reveal>
      </div>
    </section>
  )
}

export function HomeGivingCallout() {
  const { localize } = useLanguage()
  return (
    <section className="home-give-callout">
      <div className="container home-give-callout__layout">
        <Reveal><span><HandHeart size={25} />{localize({ en: 'Partner in the mission', ta: 'ஊழியப் பணியில் பங்கெடுங்கள்' })}</span><h2>{localize({ en: 'Generosity helps worship, ministry and compassionate care move forward.', ta: 'தாராள மனம் ஆராதனை, ஊழியம் மற்றும் இரக்கப் பணிகள் முன்னேற உதவுகிறது.' })}</h2><p>{localize({ en: '“God loves a cheerful giver.” — 2 Corinthians 9:7', ta: '“உற்சாகமாய்க் கொடுக்கிறவனிடத்தில் தேவன் பிரியமாயிருக்கிறார்.” — 2 கொரிந்தியர் 9:7' })}</p></Reveal>
        <a className="button button--gold" href="#give">{localize({ en: 'Ways to give', ta: 'காணிக்கை அளிக்கும் வழிகள்' })} <ArrowRight size={17} /></a>
      </div>
    </section>
  )
}
