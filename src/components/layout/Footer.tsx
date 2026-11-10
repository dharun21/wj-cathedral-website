import { ArrowRight, ArrowUpRight, CalendarDays, MapPin, Navigation, Phone, SquarePlay } from 'lucide-react'
import { churchInfo } from '../../data/churchInfo'
import { recurringGatherings } from '../../data/recurringGatherings'
import { youtubeChannelUrl } from '../../data/sermons'
import { whatsappChannelDefaults } from '../../data/whatsappChannel'
import { useLanguage } from '../../context/LanguageContext'
import { LogoMark } from '../common/LogoMark'
import { WhatsAppIcon } from '../common/WhatsAppIcon'
import { usePublishedSiteSettings, usePublishedWorship } from '../../hooks/usePublishedContent'

const currentYear = new Date().getFullYear()

function InstagramIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" /><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" /><circle cx="17.4" cy="6.7" r="1" fill="currentColor" /></svg>
}

const exploreLinks = [
  { href: '#about', label: { en: 'About us', ta: 'எங்களைப் பற்றி' } },
  { href: '#church', label: { en: 'Church ministries', ta: 'திருச்சபை ஊழியங்கள்' } },
  { href: '#events', label: { en: 'Events & gatherings', ta: 'நிகழ்வுகள் & கூடுகைகள்' } },
  { href: '#sermons', label: { en: 'Media library', ta: 'ஊடகத் தொகுப்பு' } },
  { href: '#gallery', label: { en: 'Church gallery', ta: 'திருச்சபை படத்தொகுப்பு' } },
] as const

const participateLinks = [
  { href: '#academics', label: { en: 'Academics & admission', ta: 'கல்வி & சேர்க்கை' } },
  { href: '#community-care', label: { en: 'Community care', ta: 'சமூக அக்கறை' } },
  { href: '#prayer-helpline', label: { en: 'Prayer support', ta: 'ஜெப உதவி' } },
  { href: '#give', label: { en: 'Give to the ministry', ta: 'ஊழியத்திற்கு காணிக்கை' } },
  { href: '#contact', label: { en: 'Contact & directions', ta: 'தொடர்பு & வழிகாட்டல்' } },
] as const

export function Footer() {
  const { t, localize } = useLanguage()
  const settings = usePublishedSiteSettings().data
  const gatherings = usePublishedWorship(recurringGatherings).data.slice(0, 3)
  const name = settings?.display_name || 'WJ Cathedral'
  const address = settings ? { en: settings.address_en || churchInfo.address.en, ta: settings.address_ta || churchInfo.address.ta } : churchInfo.address
  const mapsUrl = settings?.maps_url || churchInfo.mapsUrl
  const youtubeUrl = settings?.youtube_url || youtubeChannelUrl
  const instagramUrl = settings?.instagram_url || churchInfo.instagramUrl
  const whatsappEnabled = settings?.whatsapp_channel_enabled ?? whatsappChannelDefaults.enabled
  const whatsappUrl = settings?.whatsapp_channel_url || whatsappChannelDefaults.channelUrl
  const whatsappQrUrl = settings?.whatsapp_qr_url || whatsappChannelDefaults.qrUrl
  const whatsappBlogUrl = settings?.whatsapp_blog_url || whatsappChannelDefaults.blogUrl
  const whatsappTitle = localize({
    en: settings?.whatsapp_channel_title_en || whatsappChannelDefaults.titleEn,
    ta: settings?.whatsapp_channel_title_ta || whatsappChannelDefaults.titleTa,
  })
  const contacts = [
    { ...churchInfo.contacts[0], phone: settings?.phone || churchInfo.contacts[0].phone },
    churchInfo.contacts[1],
  ]
  const footerCopy = localize({
    en: settings?.footer_en || 'A church family in Nannilam growing through worship, prayer, biblical formation and compassionate service.',
    ta: settings?.footer_ta || 'ஆராதனை, ஜெபம், வேதாகம உருவாக்கம் மற்றும் இரக்கமுள்ள சேவையில் வளரும் நன்னிலம் திருச்சபைக் குடும்பம்.',
  })
  return (
    <footer className="site-footer">
      <div className="footer-glow" aria-hidden="true" />

      <div className="footer-invite-wrap">
        <div className="container footer-invite">
          <div>
            <small>{localize({ en: 'There is a place for you here', ta: 'இங்கே உங்களுக்கும் ஓர் இடம் உண்டு' })}</small>
            <h2>{localize({ en: 'Come worship with the WJ Cathedral family.', ta: 'WJ Cathedral குடும்பத்துடன் ஆராதிக்க வாருங்கள்.' })}</h2>
          </div>
          <div className="footer-invite__actions">
            <a className="button button--gold" href={mapsUrl} target="_blank" rel="noreferrer"><Navigation size={18} /> {t('common.getDirections')}</a>
            <a className="button button--outline-light" href="#prayer-helpline">{localize({ en: 'Request prayer', ta: 'ஜெப உதவி பெறுங்கள்' })} <ArrowRight size={17} /></a>
          </div>
        </div>
      </div>

      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="footer-brand__title">
            <LogoMark />
            <div><strong>{name}</strong><span>{localize(churchInfo.locationShort)}</span></div>
          </div>
          <p>{footerCopy}</p>
          <div className="footer-socials" aria-label={localize({ en: 'Official social channels', ta: 'அதிகாரப்பூர்வ சமூக வலைதளங்கள்' })}>
            <a href={youtubeUrl} target="_blank" rel="noreferrer" aria-label={t('header.youtube')}><SquarePlay size={18} /> YouTube</a>
            <a href={instagramUrl} target="_blank" rel="noreferrer" aria-label={t('header.instagram')}><InstagramIcon /> Instagram</a>
            {whatsappEnabled && <a href={whatsappUrl} target="_blank" rel="noreferrer" aria-label={whatsappTitle}><WhatsAppIcon /> WhatsApp</a>}
          </div>
        </div>

        <nav className="footer-links" aria-label={localize({ en: 'Explore', ta: 'ஆராயுங்கள்' })}>
          <h3>{localize({ en: 'Explore', ta: 'ஆராயுங்கள்' })}</h3>
          <ul>{exploreLinks.map((item) => <li key={item.href}><a href={item.href}>{localize(item.label)}</a></li>)}</ul>
        </nav>

        <nav className="footer-links" aria-label={localize({ en: 'Take part', ta: 'பங்கேற்கவும்' })}>
          <h3>{localize({ en: 'Take part', ta: 'பங்கேற்கவும்' })}</h3>
          <ul>{participateLinks.map((item) => <li key={item.href}><a href={item.href}>{localize(item.label)}</a></li>)}</ul>
        </nav>

        <div className="footer-gatherings">
          <h3>{localize({ en: 'Gather with us', ta: 'எங்களுடன் கூடுங்கள்' })}</h3>
          <ul>
            {gatherings.map((gathering) => (
              <li key={gathering.id}>
                <CalendarDays size={18} aria-hidden="true" />
                <span><strong>{localize(gathering.name)}</strong><small>{localize(gathering.day)} · {localize(gathering.time)}</small></span>
              </li>
            ))}
          </ul>
          <a className="footer-schedule-link" href="#events">{localize({ en: 'View the full prayer schedule', ta: 'முழு ஜெப அட்டவணையைப் பாருங்கள்' })} <ArrowRight size={15} /></a>
        </div>
      </div>

      {whatsappEnabled && <div className="container footer-whatsapp-wrap"><section className="footer-whatsapp-card">
        <div className="footer-whatsapp-card__copy"><small>{localize({ en: 'Official WhatsApp channel', ta: 'அதிகாரப்பூர்வ WhatsApp சேனல்' })}</small><h2>{whatsappTitle}</h2><p>{localize({ en: 'Scan the QR code or use the button to receive church updates directly on WhatsApp.', ta: 'திருச்சபை அறிவிப்புகளை WhatsApp-ல் நேரடியாகப் பெற QR குறியீட்டை ஸ்கேன் செய்யவும் அல்லது பொத்தானைப் பயன்படுத்தவும்.' })}</p><div><a className="button button--gold" href={whatsappUrl} target="_blank" rel="noreferrer"><WhatsAppIcon /> {localize({ en: 'Follow the channel', ta: 'சேனலைப் பின்தொடருங்கள்' })}</a><a className="footer-whatsapp-card__blog" href={whatsappBlogUrl} target="_blank" rel="noreferrer">{localize({ en: 'Read: Jesus Loves People', ta: 'வாசிக்க: இயேசு மக்களை நேசிக்கிறார்' })} <ArrowUpRight size={15} /></a></div></div>
        <a className="footer-whatsapp-card__qr" href={whatsappUrl} target="_blank" rel="noreferrer" aria-label={localize({ en: 'Open the WJ Cathedral WhatsApp channel', ta: 'WJ Cathedral WhatsApp சேனலைத் திறக்கவும்' })}><img src={whatsappQrUrl} alt={localize({ en: 'QR code for the WJ Cathedral WhatsApp channel', ta: 'WJ Cathedral WhatsApp சேனலுக்கான QR குறியீடு' })} /><span>{localize({ en: 'Scan to follow', ta: 'பின்தொடர ஸ்கேன் செய்யவும்' })}</span></a>
      </section></div>}

      <div className="container footer-contact-bar">
        <a className="footer-address" href={mapsUrl} target="_blank" rel="noreferrer"><MapPin size={19} /><span><small>{t('contact.address')}</small><strong>{localize(address)}</strong></span></a>
        <div className="footer-contacts">
          {contacts.map((contact) => <a href={`tel:${contact.phone}`} key={contact.id}><Phone size={17} /><span><small>{contact.name}</small><strong>{contact.display}</strong></span></a>)}
        </div>
      </div>

      <div className="container footer-bottom">
        <p>© {currentYear} {name}. {t('footer.rights')}</p>
        <a href="#home">{t('a11y.backToTop')} <ArrowUpRight size={15} aria-hidden="true" /></a>
      </div>
    </footer>
  )
}

