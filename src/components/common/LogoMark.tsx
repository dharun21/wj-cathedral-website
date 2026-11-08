export function LogoMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`logo-mark ${compact ? 'logo-mark--compact' : ''}`} aria-hidden="true">
      <img src="./branding/wj-cathedral-logo-theme.png" alt="" />
    </span>
  )
}

