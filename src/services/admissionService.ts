import { z } from 'zod'
import { requireSupabase } from '../lib/supabase'
import type { AdmissionApplicationRow, AdmissionApplicationStatus } from '../types/database'

const studyInterests = ['bachelor-theology', 'certificate-theology', 'diploma-music', 'other'] as const

export const admissionSubmissionSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(7).max(20).regex(/^[0-9+() -]+$/),
  email: z.union([z.literal(''), z.string().trim().email().max(254)]),
  city: z.string().trim().min(2).max(140),
  studyInterest: z.enum(studyInterests),
  experience: z.string().trim().max(2000),
  statement: z.string().trim().min(10).max(3000),
  language: z.enum(['en', 'ta']),
  consent: z.literal(true),
  website: z.string().max(0),
})

export type AdmissionSubmission = z.infer<typeof admissionSubmissionSchema>

export async function submitAdmissionApplication(input: AdmissionSubmission) {
  const values = admissionSubmissionSchema.parse(input)
  const { data, error } = await requireSupabase().rpc('submit_admission_application', {
    p_full_name: values.fullName,
    p_phone: values.phone,
    p_email: values.email,
    p_city: values.city,
    p_study_interest: values.studyInterest,
    p_experience: values.experience,
    p_statement: values.statement,
    p_language: values.language,
    p_consent: values.consent,
    p_website: values.website,
  } as never)
  if (error) throw new Error(error.message)
  return data
}

export async function listAdmissionApplications() {
  const { data, error } = await requireSupabase()
    .from('admission_applications')
    .select('*')
    .order('submitted_at', { ascending: false })
    .limit(500)
  if (error) throw new Error(error.message)
  return (data ?? []) as AdmissionApplicationRow[]
}

export async function fetchNewAdmissionApplicationCount() {
  const { count, error } = await requireSupabase()
    .from('admission_applications')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'new')
  if (error) throw new Error(error.message)
  return count ?? 0
}

const admissionReviewSchema = z.object({
  status: z.enum(['new', 'reviewing', 'contacted', 'closed']),
  ownerNotes: z.string().trim().max(3000),
})

export async function updateAdmissionApplication(id: string, status: AdmissionApplicationStatus, ownerNotes: string) {
  const values = admissionReviewSchema.parse({ status, ownerNotes })
  const { data, error } = await requireSupabase()
    .from('admission_applications')
    .update({ status: values.status, owner_notes: values.ownerNotes } as never)
    .eq('id', id)
    .select('*')
    .single()
  if (error) throw new Error(error.message)
  return data as AdmissionApplicationRow
}
