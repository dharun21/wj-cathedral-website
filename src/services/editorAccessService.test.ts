import { describe, expect, it } from 'vitest'
import { createEditorSchema } from './editorAccessService'

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
})
