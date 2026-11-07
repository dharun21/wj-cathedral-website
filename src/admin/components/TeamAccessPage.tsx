import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Check, Copy, Eye, EyeOff, KeyRound, Mail, RefreshCcw, ShieldCheck, ShieldOff, Trash2, UserPlus, UsersRound } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { changeEditorAccess, createManagedEditor, listManagedEditors, type ManagedEditor } from '../../services/editorAccessService'
import { useNotification } from '../context/NotificationContext'
import { ConfirmDialog } from './ConfirmDialog'

function generateTemporaryPassword() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%'
  const bytes = crypto.getRandomValues(new Uint8Array(15))
  return `Wj7!${Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join('')}`
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeZone: 'Asia/Kolkata' }).format(new Date(value))
}

export function TeamAccessPage() {
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [passwordCopied, setPasswordCopied] = useState(false)
  const [confirming, setConfirming] = useState<{ editor: ManagedEditor; action: 'revoke' | 'delete' } | null>(null)
  const queryClient = useQueryClient()
  const { notify } = useNotification()
  const queryKey = ['admin', 'managed-editors']
  const editors = useQuery({ queryKey, queryFn: listManagedEditors })
  const activeCount = (editors.data ?? []).filter((editor) => editor.is_active).length

  const createEditor = useMutation({
    mutationFn: () => createManagedEditor({ displayName, email, password }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey })
      setDisplayName(''); setEmail(''); setPassword(''); setShowPassword(false); setPasswordCopied(false)
      notify('Editor account created with active access.')
    },
    onError: (error) => notify(error instanceof Error ? error.message : 'The editor could not be created.', 'error'),
  })
  const changeAccess = useMutation({
    mutationFn: ({ editorId, action }: { editorId: string; action: 'revoke' | 'restore' | 'delete' }) => changeEditorAccess(editorId, action),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey })
      setConfirming(null)
      notify(variables.action === 'delete' ? 'Editor user permanently deleted.' : variables.action === 'revoke' ? 'Editor access removed.' : 'Editor access restored.')
    },
    onError: (error) => notify(error instanceof Error ? error.message : 'The access change failed.', 'error'),
  })

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (activeCount >= 2) return notify('Two editors already have active access. Remove one editor’s access first.', 'error')
    createEditor.mutate()
  }

  return <section className="admin-team-page">
    <div className="admin-page-heading"><div><p>Administration</p><h1>Team & Access</h1><span>Create editor accounts and control who can currently access the CMS.</span></div><div className="admin-editor-capacity"><strong>{activeCount}<span>/2</span></strong><small>active editors</small></div></div>
    <div className="admin-private-notice"><ShieldCheck size={20} /><div><strong>Owner-only access control</strong><p>Removing access keeps the user account for later restoration. Deleting permanently removes the Auth user. Passwords are sent directly to Supabase Auth and are never stored in the website database.</p></div></div>
    <div className="admin-team-layout">
      <section className="admin-settings-card admin-create-editor"><header><span><UserPlus size={21} /></span><div><p>New editor</p><h2>Create account & grant access</h2></div></header>{activeCount >= 2 && <div className="admin-team-limit"><UsersRound size={18} /><p>The two active editor places are currently filled. Remove access from an editor before creating or restoring another.</p></div>}<form onSubmit={submit} className="admin-form-grid">
        <label className="is-full"><span>Editor full name</span><input required minLength={2} maxLength={100} autoComplete="off" value={displayName} onChange={(event) => setDisplayName(event.target.value)} /></label>
        <label className="is-full"><span>Email / Gmail address</span><input required type="email" autoComplete="off" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
        <label className="is-full"><span>Temporary password</span><div className="admin-password-field"><input required type={showPassword ? 'text' : 'password'} minLength={12} maxLength={72} autoComplete="new-password" value={password} onChange={(event) => { setPassword(event.target.value); setPasswordCopied(false) }} /><button type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button><button type="button" disabled={!password} onClick={async () => { try { await navigator.clipboard.writeText(password); setPasswordCopied(true); window.setTimeout(() => setPasswordCopied(false), 1800) } catch { setPasswordCopied(false) } }} aria-label="Copy temporary password">{passwordCopied ? <Check size={17} /> : <Copy size={17} />}</button></div><em>Use 12–72 characters containing letters and numbers. Copy and share it privately; ask the editor to change it using “Forgot password”.</em></label>
        <div className="admin-create-editor__actions"><button type="button" className="admin-secondary-button" onClick={() => { setPassword(generateTemporaryPassword()); setShowPassword(true) }}><KeyRound size={16} /> Generate password</button><button className="admin-primary-button" disabled={createEditor.isPending || activeCount >= 2}>{createEditor.isPending ? 'Creating…' : 'Create account & grant access'}</button></div>
      </form></section>
      <section className="admin-panel admin-editor-roster"><header><div><p>Editor accounts</p><h2>Access roster</h2></div></header>{editors.isLoading ? <div className="admin-record-skeletons"><i /><i /></div> : editors.isError ? <div className="admin-empty-state"><UsersRound /><h3>Editors could not be loaded</h3><p>{editors.error instanceof Error ? editors.error.message : 'Check the Edge Function deployment.'}</p></div> : editors.data?.length ? <div className="admin-editor-list">{editors.data.map((editor) => <article key={editor.user_id}><div className="admin-editor-list__avatar">{editor.display_name.slice(0, 1).toUpperCase()}</div><div className="admin-editor-list__identity"><strong>{editor.display_name}</strong><a href={`mailto:${editor.email}`}><Mail size={13} />{editor.email}</a><small>Created {formatDate(editor.created_at)}</small></div><span className={`admin-access-badge ${editor.is_active ? 'is-active' : 'is-revoked'}`}>{editor.is_active ? 'Active access' : 'Access removed'}</span><div className="admin-editor-list__actions">{editor.is_active ? <button type="button" className="admin-secondary-button" onClick={() => setConfirming({ editor, action: 'revoke' })}><ShieldOff size={16} /> Remove access</button> : <button type="button" className="admin-secondary-button" disabled={changeAccess.isPending || activeCount >= 2} onClick={() => changeAccess.mutate({ editorId: editor.user_id, action: 'restore' })}><RefreshCcw size={16} /> Restore access</button>}<button type="button" className="admin-icon-danger" onClick={() => setConfirming({ editor, action: 'delete' })} aria-label={`Delete ${editor.display_name}`}><Trash2 size={16} /></button></div></article>)}</div> : <div className="admin-empty-state"><UsersRound /><h3>No editor accounts</h3><p>Create the first editor using the secure form.</p></div>}</section>
    </div>
    {confirming && <ConfirmDialog title={confirming.action === 'delete' ? `Permanently delete ${confirming.editor.display_name}?` : `Remove access for ${confirming.editor.display_name}?`} message={confirming.action === 'delete' ? 'This permanently deletes the Supabase Auth user and editor membership. They will not be able to sign in, and this cannot be undone.' : 'The account and editor record will remain, but CMS access will stop immediately. The owner can restore access later if an editor place is available.'} confirmLabel={confirming.action === 'delete' ? 'Delete user permanently' : 'Remove access'} busy={changeAccess.isPending} onCancel={() => setConfirming(null)} onConfirm={() => changeAccess.mutate({ editorId: confirming.editor.user_id, action: confirming.action })} />}
  </section>
}
