import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Eye, EyeOff, KeyRound, Mail, ShieldAlert } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { LogoMark } from '../../components/common/LogoMark'
import { requestPasswordReset, updateAdminPassword } from '../../services/authService'
import { useAdminAuth } from '../context/AdminAuthContext'

const loginSchema = z.object({ email: z.email('Enter a valid email address.'), password: z.string().min(8, 'Enter your password.') })
type LoginValues = z.infer<typeof loginSchema>

export function AdminLogin() {
  const { login } = useAdminAuth()
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const form = useForm<LoginValues>({ resolver: zodResolver(loginSchema), defaultValues: { email: '', password: '' } })
  const submit = form.handleSubmit(async (values) => {
    setError('')
    try {
      await login(values.email, values.password)
      window.location.assign('#/admin/dashboard')
    } catch {
      setError('The email or password is incorrect, or this account is not authorized.')
    }
  })
  return (
    <main className="admin-auth-page">
      <section className="admin-auth-card" aria-labelledby="admin-login-title">
        <div className="admin-auth-brand"><LogoMark /></div>
        <p className="admin-auth-eyebrow">WJ Cathedral CMS</p>
        <h1 id="admin-login-title">Sign in</h1>
        <p>Manage approved church content, events, photos and service information.</p>
        {error && <div className="admin-form-error" role="alert"><ShieldAlert size={17} /> {error}</div>}
        <form onSubmit={submit} className="admin-auth-form">
          <label><span>Email address</span><div><Mail size={17} /><input type="email" autoComplete="email" {...form.register('email')} /></div><small>{form.formState.errors.email?.message}</small></label>
          <label><span>Password</span><div><KeyRound size={17} /><input type={showPassword ? 'text' : 'password'} autoComplete="current-password" {...form.register('password')} /><button type="button" className="admin-auth-password-toggle" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div><small>{form.formState.errors.password?.message}</small></label>
          <button type="submit" className="admin-primary-button" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? 'Signing in…' : 'Sign in securely'}</button>
        </form>
        <div className="admin-auth-actions">
          <button type="button" className="admin-text-button" onClick={() => { window.location.hash = '#/admin/forgot-password' }}>Forgot password?</button>
          <a className="admin-back-link" href="#home"><ArrowLeft size={16} /> Return to website</a>
        </div>
      </section>
    </main>
  )
}

export function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    try {
      await requestPasswordReset(email)
      setMessage('If an authorized account exists for this address, a reset link has been sent.')
    } catch {
      setError('The reset request could not be completed. Please try again.')
    }
  }
  return (
    <main className="admin-auth-page"><section className="admin-auth-card">
      <div className="admin-auth-mark"><Mail size={28} /></div><p className="admin-auth-eyebrow">Account recovery</p><h1>Reset your password</h1>
      <p>Enter the email address assigned to your administrator account.</p>
      {message && <div className="admin-form-success">{message}</div>}{error && <div className="admin-form-error" role="alert">{error}</div>}
      <form onSubmit={submit} className="admin-auth-form"><label><span>Email address</span><div><Mail size={17} /><input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></div></label><button className="admin-primary-button">Send reset link</button></form>
      <button type="button" className="admin-back-link" onClick={() => { window.location.hash = '#/admin/login' }}><ArrowLeft size={16} /> Back to sign in</button>
    </section></main>
  )
}

export function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    if (password.length < 12) return setError('Use at least 12 characters.')
    if (password !== confirm) return setError('The passwords do not match.')
    try {
      await updateAdminPassword(password)
      setMessage('Password updated. You can now continue to the dashboard.')
    } catch {
      setError('The reset link may have expired. Request a new link and try again.')
    }
  }
  return (
    <main className="admin-auth-page"><section className="admin-auth-card">
      <div className="admin-auth-mark"><KeyRound size={28} /></div><p className="admin-auth-eyebrow">Secure password reset</p><h1>Choose a new password</h1>
      <p>Use at least 12 characters and avoid reusing a password from another service.</p>
      {message && <div className="admin-form-success">{message}</div>}{error && <div className="admin-form-error" role="alert">{error}</div>}
      <form onSubmit={submit} className="admin-auth-form">
        <label><span>New password</span><div><KeyRound size={17} /><input type={showPassword ? 'text' : 'password'} required value={password} onChange={(event) => setPassword(event.target.value)} /><button type="button" className="admin-auth-password-toggle" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? 'Hide passwords' : 'Show passwords'}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label>
        <label><span>Confirm password</span><div><KeyRound size={17} /><input type={showPassword ? 'text' : 'password'} required value={confirm} onChange={(event) => setConfirm(event.target.value)} /></div></label>
        <button className="admin-primary-button">Update password</button>
      </form>
      {message && <button className="admin-text-button" onClick={() => { window.location.hash = '#/admin/dashboard' }}>Continue to dashboard</button>}
    </section></main>
  )
}

export function SupabaseSetupRequired() {
  return <main className="admin-auth-page"><section className="admin-auth-card"><div className="admin-auth-mark"><ShieldAlert size={28} /></div><p className="admin-auth-eyebrow">Setup required</p><h1>Connect Supabase locally</h1><p>The CMS code is ready, but this browser has no Supabase project configuration. Copy <code>.env.example</code> to <code>.env.local</code> and add the project URL and public anon key. Never add a service-role key.</p><a className="admin-back-link" href="#home"><ArrowLeft size={16} /> Return to website</a></section></main>
}

export function UnauthorizedAdmin() {
  const { logout, user } = useAdminAuth()
  return <main className="admin-auth-page"><section className="admin-auth-card"><div className="admin-auth-mark"><ShieldAlert size={28} /></div><p className="admin-auth-eyebrow">Access restricted</p><h1>This account is not an administrator</h1><p>{user?.email || 'The signed-in account'} does not have an active membership in the admin panel.</p><button className="admin-primary-button" onClick={() => void logout()}>Sign out</button></section></main>
}
