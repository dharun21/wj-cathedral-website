import { Check, Copy, GraduationCap, HandHeart, Landmark, Phone, QrCode, ShieldAlert, ShieldCheck, Sprout } from 'lucide-react'
import { useState } from 'react'
import { Reveal } from '../components/common/Reveal'
import { churchInfo } from '../data/churchInfo'
import { approvedGivingDetails } from '../data/giving'
import { useLanguage } from '../context/LanguageContext'
import { usePublishedSiteSettings } from '../hooks/usePublishedContent'
import { isSupabaseConfigured } from '../lib/env'

const copy = {
  eyebrow: { en: 'Giving at WJ Cathedral', ta: 'WJ Cathedral காணிக்கை' },
  title: { en: 'Give with purpose. Serve with love.', ta: 'நோக்கத்துடன் கொடுங்கள். அன்புடன் சேவை செய்யுங்கள்.' },
  intro: {
    en: 'Your voluntary support can help strengthen church ministry, Bible education and compassionate service in the community.',
    ta: 'உங்கள் விருப்பமான ஆதரவு திருச்சபை ஊழியம், வேதாகமக் கல்வி மற்றும் சமூகத்தில் இரக்கமுள்ள சேவையை வலுப்படுத்த உதவும்.',
  },
  supportEyebrow: { en: 'What your giving can support', ta: 'உங்கள் காணிக்கை ஆதரிக்கக்கூடிய பணிகள்' },
  supportTitle: { en: 'Together, we can serve faithfully', ta: 'ஒன்றிணைந்து உண்மையுடன் சேவை செய்யலாம்' },
  churchTitle: { en: 'Church & Gospel Ministry', ta: 'திருச்சபை மற்றும் சுவிசேஷ ஊழியம்' },
  churchBody: { en: 'Support worship, prayer, discipleship, church ministry and Gospel outreach.', ta: 'ஆராதனை, ஜெபம், சீஷத்துவம், திருச்சபை ஊழியம் மற்றும் சுவிசேஷப் பணியை ஆதரிக்கவும்.' },
  academicsTitle: { en: 'Bible Education', ta: 'வேதாகமக் கல்வி' },
  academicsBody: { en: 'Help strengthen theological learning and ministry preparation through the Bible institute and college.', ta: 'வேதாகம நிறுவனம் மற்றும் கல்லூரி மூலம் இறையியல் கல்வியையும் ஊழிய ஆயத்தத்தையும் வலுப்படுத்த உதவுங்கள்.' },
  careTitle: { en: 'Community Care', ta: 'சமூக அக்கறை' },
  careBody: { en: 'Support compassionate initiatives serving families, students, patients and the wider community.', ta: 'குடும்பங்கள், மாணவர்கள், நோயாளிகள் மற்றும் சமூகத்திற்குச் சேவை செய்யும் இரக்கப் பணிகளை ஆதரிக்கவும்.' },
  stewardshipEyebrow: { en: 'Responsible stewardship', ta: 'பொறுப்பான பராமரிப்பு' },
  stewardshipTitle: { en: 'Give prayerfully and with confidence', ta: 'ஜெபத்துடனும் நம்பிக்கையுடனும் கொடுங்கள்' },
  stewardshipBody: { en: 'Before giving, you are welcome to contact the church to confirm current needs, the intended purpose of your contribution and the correct recipient details.', ta: 'காணிக்கை அளிப்பதற்கு முன் தற்போதைய தேவைகள், உங்கள் காணிக்கையின் நோக்கம் மற்றும் சரியான பெறுநர் விவரங்களை திருச்சபையிடம் உறுதிப்படுத்தலாம்.' },
  voluntary: { en: 'Giving is always voluntary—there is no pressure or required amount.', ta: 'காணிக்கை எப்போதும் விருப்பமானது—எந்த அழுத்தமும் கட்டாயத் தொகையும் இல்லை.' },
  verified: { en: 'Use only owner-verified payment details published on this page.', ta: 'இந்தப் பக்கத்தில் உரிமையாளரால் சரிபார்த்து வெளியிடப்பட்ட கட்டண விவரங்களை மட்டுமே பயன்படுத்தவும்.' },
  contact: { en: 'Contact the church if you need confirmation or a receipt.', ta: 'உறுதிப்படுத்தல் அல்லது ரசீது தேவைப்பட்டால் திருச்சபையைத் தொடர்புகொள்ளவும்.' },
  paymentEyebrow: { en: 'Ways to give', ta: 'காணிக்கை அளிக்கும் வழிகள்' },
  paymentTitle: { en: 'Bank transfer or GPay', ta: 'வங்கி பரிமாற்றம் அல்லது GPay' },
  paymentIntro: { en: 'This website does not process payments. Use your trusted bank or GPay application after carefully checking the recipient details.', ta: 'இந்த இணையதளம் பணப்பரிவர்த்தனைகளைச் செயலாக்காது. பெறுநர் விவரங்களை கவனமாகச் சரிபார்த்த பின் உங்கள் நம்பகமான வங்கி அல்லது GPay செயலியைப் பயன்படுத்தவும்.' },
  bank: { en: 'Bank account', ta: 'வங்கி கணக்கு' },
  accountName: { en: 'Account name', ta: 'கணக்கு பெயர்' },
  bankName: { en: 'Bank name', ta: 'வங்கி பெயர்' },
  bankBranch: { en: 'Branch', ta: 'வங்கிக் கிளை' },
  accountNumber: { en: 'Account number', ta: 'கணக்கு எண்' },
  ifsc: { en: 'IFSC code', ta: 'IFSC குறியீடு' },
  gpay: { en: 'GPay', ta: 'GPay' },
  gpayNumber: { en: 'Approved GPay number', ta: 'அங்கீகரிக்கப்பட்ட GPay எண்' },
  gpayName: { en: 'Recipient name', ta: 'பெறுநர் பெயர்' },
  upiId: { en: 'UPI ID', ta: 'UPI ID' },
  qrAlt: { en: 'Verified WJ Cathedral GPay QR code', ta: 'சரிபார்க்கப்பட்ட WJ Cathedral GPay QR குறியீடு' },
  scripture: { en: 'God loves a cheerful giver.', ta: 'மகிழ்ச்சியாய்க் கொடுக்கிறவனிடத்தில் தேவன் பிரியமாயிருக்கிறார்.' },
  scriptureReference: { en: '2 Corinthians 9:7', ta: '2 கொரிந்தியர் 9:7' },
  copy: { en: 'Copy', ta: 'நகலெடுக்கவும்' },
  copied: { en: 'Copied', ta: 'நகலெடுக்கப்பட்டது' },
  pendingTitle: { en: 'Payment details are being confirmed', ta: 'கட்டண விவரங்கள் உறுதிப்படுத்தப்படுகின்றன' },
  pendingBody: { en: 'Bank account and GPay details will appear here only after they are verified and approved by the church owner. Please do not transfer money using details received from an unverified source.', ta: 'வங்கி கணக்கு மற்றும் GPay விவரங்கள் திருச்சபை உரிமையாளரால் சரிபார்த்து அங்கீகரிக்கப்பட்ட பின்னரே இங்கே காட்டப்படும். சரிபார்க்கப்படாத வழியில் பெறப்பட்ட விவரங்களுக்கு பணம் அனுப்ப வேண்டாம்.' },
  safety: { en: 'WJ Cathedral will never ask for your OTP, UPI PIN, card PIN or banking password.', ta: 'WJ Cathedral உங்கள் OTP, UPI PIN, அட்டை PIN அல்லது வங்கி கடவுச்சொல்லை ஒருபோதும் கேட்காது.' },
}

function CopyValue({ label, value }: { label: string; value: string }) {
  const { localize } = useLanguage()
  const [copied, setCopied] = useState(false)
  const copyValue = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }
  return <div className="give-detail"><span>{label}</span><strong>{value}</strong><button type="button" onClick={() => void copyValue()} aria-label={`${localize(copy.copy)} ${label}`}>{copied ? <Check size={15} /> : <Copy size={15} />}{localize(copied ? copy.copied : copy.copy)}</button></div>
}

export function GivePage() {
  const { localize } = useLanguage()
  const settings = usePublishedSiteSettings().data
  const contactPhone = settings?.phone || churchInfo.phone
  const useCmsDetails = settings?.giving_payment_verified === true
  const useLocalDetails = !isSupabaseConfigured
  const details = {
    accountName: useCmsDetails ? settings.giving_account_name : useLocalDetails ? approvedGivingDetails.accountName : null,
    bankName: useCmsDetails ? settings.giving_bank_name : useLocalDetails ? approvedGivingDetails.bankName : null,
    bankBranch: useCmsDetails ? settings.giving_bank_branch : useLocalDetails ? approvedGivingDetails.bankBranch : null,
    accountNumber: useCmsDetails ? settings.giving_account_number : useLocalDetails ? approvedGivingDetails.accountNumber : null,
    ifsc: useCmsDetails ? settings.giving_ifsc : useLocalDetails ? approvedGivingDetails.ifsc : null,
    gpayNumber: useCmsDetails ? settings.giving_gpay_number : useLocalDetails ? approvedGivingDetails.gpayNumber : null,
    gpayName: useCmsDetails ? settings.giving_gpay_name : useLocalDetails ? approvedGivingDetails.gpayName : null,
    upiId: useCmsDetails ? settings.giving_upi_id : useLocalDetails ? approvedGivingDetails.upiId : null,
    qrUrl: useCmsDetails ? settings.giving_qr_url : useLocalDetails ? approvedGivingDetails.qrUrl : null,
  }
  const verified = useCmsDetails || useLocalDetails
  const hasBank = Boolean(verified && details.accountName && details.bankName && details.accountNumber && details.ifsc)
  const hasGpay = Boolean(verified && details.gpayNumber)
  const hasQr = Boolean(verified && details.qrUrl)
  const hasPaymentDetails = hasBank || hasGpay
  const supportAreas = [
    { Icon: Landmark, title: copy.churchTitle, body: copy.churchBody },
    { Icon: GraduationCap, title: copy.academicsTitle, body: copy.academicsBody },
    { Icon: Sprout, title: copy.careTitle, body: copy.careBody },
  ]

  return <main id="main-content" tabIndex={-1} className="give-page">
    <section className="give-hero">
      <div className="give-hero__glow" aria-hidden="true" />
      <div className="container give-hero__content">
        <Reveal>
          <p>{localize(copy.eyebrow)}</p>
          <h1>{localize(copy.title)}</h1>
          <span>{localize(copy.intro)}</span>
          <a className="button button--gold" href="#give-options">{localize(copy.paymentEyebrow)}</a>
        </Reveal>
        <Reveal className="give-hero__mark" delay={0.08}><HandHeart size={68} aria-hidden="true" /><small>WJ</small><strong>Give</strong></Reveal>
      </div>
    </section>

    <section className="section section--ivory give-support">
      <div className="container">
        <div className="page-section-heading"><p>{localize(copy.supportEyebrow)}</p><h2>{localize(copy.supportTitle)}</h2></div>
        <div className="give-support__grid">{supportAreas.map(({ Icon, title, body }, index) => <Reveal className="give-support-card" key={title.en} delay={index * .06}><span><Icon size={27} aria-hidden="true" /></span><h3>{localize(title)}</h3><p>{localize(body)}</p></Reveal>)}</div>
      </div>
    </section>

    <section className="give-scripture" aria-labelledby="giving-scripture">
      <div className="container">
        <Reveal>
          <HandHeart size={32} aria-hidden="true" />
          <blockquote id="giving-scripture">“{localize(copy.scripture)}”</blockquote>
          <cite>— {localize(copy.scriptureReference)}</cite>
        </Reveal>
      </div>
    </section>

    <section className="section give-stewardship">
      <div className="container give-stewardship__layout">
        <Reveal className="give-stewardship__copy"><p>{localize(copy.stewardshipEyebrow)}</p><h2>{localize(copy.stewardshipTitle)}</h2><span>{localize(copy.stewardshipBody)}</span></Reveal>
        <Reveal className="give-stewardship__principles" delay={0.08}>
          {[copy.voluntary, copy.verified, copy.contact].map((item) => <div key={item.en}><ShieldCheck size={20} aria-hidden="true" /><p>{localize(item)}</p></div>)}
        </Reveal>
      </div>
    </section>

    <section id="give-options" className="section section--sand give-options">
      <div className="container">
        <div className="page-section-heading page-section-heading--split"><div><p>{localize(copy.paymentEyebrow)}</p><h2>{localize(copy.paymentTitle)}</h2></div><p>{localize(copy.paymentIntro)}</p></div>
        {hasPaymentDetails ? <div className="give-payment-grid">
          {hasBank && <Reveal className="give-payment-card"><header><span><Landmark size={24} /></span><h3>{localize(copy.bank)}</h3></header><CopyValue label={localize(copy.accountName)} value={details.accountName!} /><CopyValue label={localize(copy.bankName)} value={details.bankName!} />{details.bankBranch && <CopyValue label={localize(copy.bankBranch)} value={details.bankBranch} />}<CopyValue label={localize(copy.accountNumber)} value={details.accountNumber!} /><CopyValue label={localize(copy.ifsc)} value={details.ifsc!} /></Reveal>}
          {hasGpay && <Reveal className="give-payment-card give-payment-card--gpay" delay={.06}><header><span><QrCode size={24} /></span><h3>{localize(copy.gpay)}</h3></header>{hasQr && <img src={details.qrUrl!} alt={localize(copy.qrAlt)} loading="lazy" />}{details.gpayName && <CopyValue label={localize(copy.gpayName)} value={details.gpayName} />}<CopyValue label={localize(copy.gpayNumber)} value={details.gpayNumber!} />{details.upiId && <CopyValue label={localize(copy.upiId)} value={details.upiId} />}</Reveal>}
        </div> : <Reveal className="give-pending"><span><ShieldAlert size={30} aria-hidden="true" /></span><div><h3>{localize(copy.pendingTitle)}</h3><p>{localize(copy.pendingBody)}</p><a href={`tel:${contactPhone}`}><Phone size={17} />{contactPhone}</a></div></Reveal>}
        {useCmsDetails && (settings.giving_note_en || settings.giving_note_ta) && <p className="give-owner-note">{localize({ en: settings.giving_note_en || '', ta: settings.giving_note_ta || '' })}</p>}
        <div className="give-safety"><ShieldCheck size={20} aria-hidden="true" /><strong>{localize(copy.safety)}</strong></div>
      </div>
    </section>
  </main>
}
