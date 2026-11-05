export function LogoMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`logo-mark ${compact ? 'logo-mark--compact' : ''}`} aria-hidden="true">
      <span className="logo-mark__cross" />
      <span className="logo-mark__letters">WJ</span>
    </span>
  )
}

