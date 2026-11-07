import { CheckCircle2, CircleAlert, Info, X } from 'lucide-react'
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

type NoticeTone = 'success' | 'error' | 'info'

interface Notice {
  id: string
  message: string
  tone: NoticeTone
}

interface NotificationValue {
  notify: (message: string, tone?: NoticeTone) => void
}

const NotificationContext = createContext<NotificationValue | null>(null)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notices, setNotices] = useState<Notice[]>([])
  const dismiss = useCallback((id: string) => setNotices((current) => current.filter((notice) => notice.id !== id)), [])
  const notify = useCallback((message: string, tone: NoticeTone = 'success') => {
    const id = crypto.randomUUID()
    setNotices((current) => [...current, { id, message, tone }])
    window.setTimeout(() => dismiss(id), 4800)
  }, [dismiss])
  const value = useMemo(() => ({ notify }), [notify])
  return (
    <NotificationContext.Provider value={value}>
      {children}
      <div className="admin-toasts" aria-live="polite">
        {notices.map((notice) => {
          const Icon = notice.tone === 'success' ? CheckCircle2 : notice.tone === 'error' ? CircleAlert : Info
          return (
            <div className={`admin-toast admin-toast--${notice.tone}`} key={notice.id} role={notice.tone === 'error' ? 'alert' : 'status'}>
              <Icon size={19} aria-hidden="true" /><span>{notice.message}</span>
              <button type="button" onClick={() => dismiss(notice.id)} aria-label="Dismiss notification"><X size={16} /></button>
            </div>
          )
        })}
      </div>
    </NotificationContext.Provider>
  )
}

// oxlint-disable-next-line react/only-export-components -- Provider and hook form one notification module.
export function useNotification() {
  const value = useContext(NotificationContext)
  if (!value) throw new Error('useNotification must be used inside NotificationProvider')
  return value
}
