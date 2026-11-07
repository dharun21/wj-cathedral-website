import { describe, expect, it } from 'vitest'
import { admissionSubmissionSchema } from './admissionService'

const validApplication = {
  fullName: 'Test Applicant',
  phone: '9788056467',
  email: 'applicant@example.com',
  city: 'Nannilam',
  studyInterest: 'bachelor-theology' as const,
  experience: 'Church volunteer',
  statement: 'I would like to prepare for faithful ministry service.',
  language: 'en' as const,
  consent: true as const,
  website: '',
}

describe('admission submission validation', () => {
  it('accepts a complete consented enquiry', () => {
    expect(admissionSubmissionSchema.safeParse(validApplication).success).toBe(true)
  })

  it('rejects submissions without consent', () => {
    expect(admissionSubmissionSchema.safeParse({ ...validApplication, consent: false }).success).toBe(false)
  })

  it('rejects invalid contact details and bot honeypot values', () => {
    expect(admissionSubmissionSchema.safeParse({ ...validApplication, phone: '<script>', website: 'spam.example' }).success).toBe(false)
  })
})
