import { CheckCircle2, FileText, LoaderCircle, Printer, Send, ShieldCheck } from 'lucide-react'
import { useState, type FormEvent, type MouseEvent } from 'react'
import { academicInterestOptions } from '../../data/academics'
import { useLanguage } from '../../context/LanguageContext'
import { isSupabaseConfigured } from '../../lib/env'
import { submitAdmissionApplication } from '../../services/admissionService'
import { Reveal } from '../common/Reveal'
import { SectionHeading } from '../common/SectionHeading'

export function AdmissionForm() {
  const { t, localize, language } = useLanguage()
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.reportValidity() || submitting || !isSupabaseConfigured) return
    const values = new FormData(form)
    const consent = values.get('consent') === 'on'
    if (!consent) return
    setSubmitting(true)
    setSubmitted(false)
    setError('')
    try {
      await submitAdmissionApplication({
        fullName: String(values.get('fullName') ?? ''),
        phone: String(values.get('phone') ?? ''),
        email: String(values.get('email') ?? ''),
        city: String(values.get('city') ?? ''),
        studyInterest: String(values.get('studyInterest') ?? '') as 'bachelor-theology' | 'certificate-theology' | 'diploma-music' | 'other',
        experience: String(values.get('experience') ?? ''),
        statement: String(values.get('statement') ?? ''),
        language,
        consent: true,
        website: String(values.get('website') ?? ''),
      })
      form.reset()
      setSubmitted(true)
    } catch {
      setError(t('academics.admission.submitError'))
    } finally {
      setSubmitting(false)
    }
  }

  const handlePrint = (event: MouseEvent<HTMLButtonElement>) => {
    const form = event.currentTarget.form
    if (!form?.reportValidity()) return
    window.print()
  }

  return (
    <section id="academics-admission" className="section section--navy academic-admission">
      <div className="container academic-admission__layout">
        <Reveal className="academic-admission__intro">
          <SectionHeading
            eyebrow={t('academics.admission.eyebrow')}
            title={t('academics.admission.title')}
            description={t('academics.admission.intro')}
          />
          <div className="academic-admission__privacy"><ShieldCheck size={20} aria-hidden="true" /><p>{t('academics.admission.note')}</p></div>
        </Reveal>

        <Reveal className="academic-form-card" delay={0.08}>
          <div className="academic-form-card__heading"><span><FileText size={23} aria-hidden="true" /></span><strong>{t('academics.admission.eyebrow')}</strong></div>
          <form className="academic-form" onSubmit={handleSubmit}>
            <label className="academic-form__website" aria-hidden="true">Website<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
            <div className="academic-form__grid">
              <label>
                <span>{t('academics.admission.fullName')} <b aria-hidden="true">*</b></span>
                <input type="text" name="fullName" autoComplete="name" required />
              </label>
              <label>
                <span>{t('academics.admission.phone')} <b aria-hidden="true">*</b></span>
                <input type="tel" name="phone" autoComplete="tel" inputMode="tel" required />
              </label>
              <label>
                <span>{t('academics.admission.email')}</span>
                <input type="email" name="email" autoComplete="email" />
              </label>
              <label>
                <span>{t('academics.admission.city')} <b aria-hidden="true">*</b></span>
                <input type="text" name="city" autoComplete="address-level2" required />
              </label>
              <label className="academic-form__full">
                <span>{t('academics.admission.interest')} <b aria-hidden="true">*</b></span>
                <select name="studyInterest" defaultValue="" required>
                  <option value="" disabled>{t('academics.admission.select')}</option>
                  {academicInterestOptions.map((option) => <option key={option.value} value={option.value}>{localize(option.label)}</option>)}
                </select>
              </label>
              <label className="academic-form__full">
                <span>{t('academics.admission.experience')}</span>
                <textarea name="experience" rows={3} placeholder={t('academics.admission.experiencePlaceholder')} />
              </label>
              <label className="academic-form__full">
                <span>{t('academics.admission.statement')} <b aria-hidden="true">*</b></span>
                <textarea name="statement" rows={4} placeholder={t('academics.admission.statementPlaceholder')} required />
              </label>
            </div>
            <label className="academic-form__consent">
              <input type="checkbox" name="consent" required />
              <span>{t('academics.admission.consent')}</span>
            </label>
            <div className="academic-form__actions">
              <button className="button button--gold academic-form__submit" type="submit" disabled={submitting || !isSupabaseConfigured}>{submitting ? <LoaderCircle className="academic-form__spinner" size={18} aria-hidden="true" /> : <Send size={18} aria-hidden="true" />} {t(submitting ? 'academics.admission.submitting' : 'academics.admission.submit')}</button>
              <button className="button button--outline-light academic-form__print" type="button" onClick={handlePrint}><Printer size={18} aria-hidden="true" /> {t('academics.admission.print')}</button>
            </div>
            {submitted && <div className="academic-form__feedback academic-form__feedback--success academic-form__feedback--after-submit" role="status"><CheckCircle2 size={22} /><div><strong>{t('academics.admission.successTitle')}</strong><p>{t('academics.admission.successBody')}</p></div></div>}
            {error && <div className="academic-form__feedback academic-form__feedback--error academic-form__feedback--after-submit" role="alert"><div><strong>{t('academics.admission.submitErrorTitle')}</strong><p>{error}</p></div></div>}
            {!isSupabaseConfigured && <div className="academic-form__feedback academic-form__feedback--notice academic-form__feedback--after-submit" role="status"><ShieldCheck size={21} /><div><strong>{t('academics.admission.onlineUnavailableTitle')}</strong><p>{t('academics.admission.onlineUnavailable')}</p></div></div>}
          </form>
        </Reveal>
      </div>
    </section>
  )
}

