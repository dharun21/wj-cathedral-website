import { FileText, Printer, ShieldCheck } from 'lucide-react'
import type { FormEvent } from 'react'
import { academicInterestOptions } from '../../data/academics'
import { useLanguage } from '../../context/LanguageContext'
import { Reveal } from '../common/Reveal'
import { SectionHeading } from '../common/SectionHeading'

export function AdmissionForm() {
  const { t, localize } = useLanguage()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!event.currentTarget.reportValidity()) return
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
            <button className="button button--navy academic-form__submit" type="submit"><Printer size={18} aria-hidden="true" /> {t('academics.admission.print')}</button>
          </form>
        </Reveal>
      </div>
    </section>
  )
}

