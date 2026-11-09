import { describe, expect, it } from 'vitest'
import { createEditorSchema, editorFunctionConnectionMessage } from './editorAccessService'

describe('owner-created editor validation', () => {
  it('accepts a valid editor account and normalizes the email address', () => {
    const result = createEditorSchema.parse({
      displayName: 'Church Editor',
      email: 'EDITOR@GMAIL.COM',
      password: 'SecureChurch2027!',
    })

    expect(result.email).toBe('editor@gmail.com')
  })

  it.each(['short7', 'letterswithoutnumbers', '123456789012'])('rejects an unsafe password: %s', (password) => {
    expect(() => createEditorSchema.parse({
      displayName: 'Church Editor',
      email: 'editor@gmail.com',
      password,
    })).toThrow()
  })

  it('explains when the editor Edge Function is missing', () => {
    expect(editorFunctionConnectionMessage({
      message: 'Edge Function returned a non-2xx status code',
      context: new Response(null, { status: 404 }),
    })).toContain('not active yet')
  })

  it('turns a generic Functions fetch error into an actionable message', () => {
    expect(editorFunctionConnectionMessage({ message: 'Failed to send a request to the Edge Function' })).toContain('could not reach Supabase')
  })
})
