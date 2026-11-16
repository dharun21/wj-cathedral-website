import { useQuery } from '@tanstack/react-query'
import { CalendarDays, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react'
import { useMemo, useState } from 'react'
import { fetchOwnerVisitorTrend } from '../../services/analyticsService'
import { indiaDateKey } from '../../utils/indiaDate'

type VisitorRange = 'today' | 'yesterday' | 'week' | 'thirty-days' | 'month'

const rangeOptions: Array<{ value: VisitorRange; label: string }> = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'week', label: 'Weekly' },
  { value: 'thirty-days', label: '30 days' },
  { value: 'month', label: 'Monthly' },
]

const chartWidth = 960
const chartHeight = 310
const chartInset = { top: 58, right: 22, bottom: 46, left: 54 }

function dateFromKey(value: string) {
  return new Date(`${value}T00:00:00Z`)
}

function dateKey(value: Date) {
  return value.toISOString().slice(0, 10)
}

function moveDays(value: Date, days: number) {
  const result = new Date(value)
  result.setUTCDate(result.getUTCDate() + days)
  return result
}

function monthStart(value: Date) {
  return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), 1))
}

function monthEnd(value: Date) {
  return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth() + 1, 0))
}

function formatDate(value: Date, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat('en-IN', { ...options, timeZone: 'UTC' }).format(value)
}

function rangeDetails(range: VisitorRange, selectedMonth: Date) {
  const today = dateFromKey(indiaDateKey())
  if (range === 'today') return { from: today, to: today, label: formatDate(today, { dateStyle: 'medium' }) }
  if (range === 'yesterday') {
    const yesterday = moveDays(today, -1)
    return { from: yesterday, to: yesterday, label: formatDate(yesterday, { dateStyle: 'medium' }) }
  }
  if (range === 'week' || range === 'thirty-days') {
    const from = moveDays(today, range === 'week' ? -6 : -29)
    const label = `${formatDate(from, { day: 'numeric', month: 'short' })} – ${formatDate(today, { day: 'numeric', month: 'short', year: 'numeric' })}`
    return { from, to: today, label }
  }
  const from = monthStart(selectedMonth)
  const end = monthEnd(selectedMonth)
  const to = dateKey(from) === dateKey(monthStart(today)) ? today : end
  return { from, to, label: formatDate(from, { month: 'long', year: 'numeric' }) }
}

function axisLabel(date: string, index: number, length: number) {
  const value = dateFromKey(date)
  if (length === 1) return formatDate(value, { day: 'numeric', month: 'short' })
  if (length <= 8) return formatDate(value, { weekday: 'short' })
  const step = Math.max(1, Math.ceil((length - 1) / 5))
  if (index === 0 || index === length - 1 || index % step === 0) return formatDate(value, { day: 'numeric', month: 'short' })
  return ''
}

function niceMaximum(value: number) {
  if (value <= 5) return 5
  const magnitude = 10 ** Math.floor(Math.log10(value))
  const normalized = value / magnitude
  const rounded = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10
  return rounded * magnitude
}

export function VisitorAnalyticsPanel() {
  const [range, setRange] = useState<VisitorRange>('week')
  const currentMonth = useMemo(() => monthStart(dateFromKey(indiaDateKey())), [])
  const [selectedMonth, setSelectedMonth] = useState(currentMonth)
  const [activeIndex, setActiveIndex] = useState(Number.MAX_SAFE_INTEGER)
  const details = rangeDetails(range, selectedMonth)
  const from = dateKey(details.from)
  const to = dateKey(details.to)
  const visitors = useQuery({
    queryKey: ['admin', 'visitor-trend', from, to],
    queryFn: () => fetchOwnerVisitorTrend(from, to),
    staleTime: 5 * 60_000,
    placeholderData: (previous) => previous,
  })
  const points = visitors.data ?? []
  const maximum = niceMaximum(Math.max(0, ...points.map((point) => point.visitors)))
  const isCurrentMonth = dateKey(selectedMonth) === dateKey(currentMonth)
  const changeMonth = (amount: number) => {
    setSelectedMonth(new Date(Date.UTC(selectedMonth.getUTCFullYear(), selectedMonth.getUTCMonth() + amount, 1)))
    setActiveIndex(Number.MAX_SAFE_INTEGER)
  }
  const plotWidth = chartWidth - chartInset.left - chartInset.right
  const plotHeight = chartHeight - chartInset.top - chartInset.bottom
  const chartPoints = points.map((point, index) => ({
    ...point,
    x: points.length === 1 ? chartInset.left + plotWidth / 2 : chartInset.left + (index / (points.length - 1)) * plotWidth,
    y: chartInset.top + plotHeight - (point.visitors / maximum) * plotHeight,
  }))
  const linePath = chartPoints.length === 1
    ? `M ${chartInset.left} ${chartPoints[0]!.y} L ${chartWidth - chartInset.right} ${chartPoints[0]!.y}`
    : chartPoints.map((point, index) => `${index ? 'L' : 'M'} ${point.x} ${point.y}`).join(' ')
  const firstPoint = chartPoints[0]
  const lastPoint = chartPoints.at(-1)
  const areaPath = firstPoint && lastPoint
    ? chartPoints.length === 1
      ? `${linePath} L ${chartWidth - chartInset.right} ${chartInset.top + plotHeight} L ${chartInset.left} ${chartInset.top + plotHeight} Z`
      : `${linePath} L ${lastPoint.x} ${chartInset.top + plotHeight} L ${firstPoint.x} ${chartInset.top + plotHeight} Z`
    : ''
  const resolvedActiveIndex = Math.min(activeIndex, Math.max(0, chartPoints.length - 1))
  const activePoint = chartPoints[resolvedActiveIndex]

  return <section className="admin-visitor-insights">
    <header className="admin-visitor-insights__header">
      <div><span><TrendingUp size={17} /> Owner analytics</span><h2>Website visitor flow</h2><p>Daily unique visits shown in India Standard Time.</p></div>
      <div className="admin-visitor-segments" role="group" aria-label="Visitor graph date range">
        {rangeOptions.map((option) => <button type="button" className={range === option.value ? 'is-active' : ''} key={option.value} onClick={() => { setRange(option.value); setActiveIndex(Number.MAX_SAFE_INTEGER) }}>{option.label}</button>)}
      </div>
    </header>

    <div className="admin-visitor-period">
      <div><CalendarDays size={17} /><strong>{details.label}</strong></div>
      {range === 'month' && <div className="admin-visitor-period__nav"><button type="button" onClick={() => changeMonth(-1)} aria-label="Previous month"><ChevronLeft size={17} /></button><button type="button" disabled={isCurrentMonth} onClick={() => changeMonth(1)} aria-label="Next month"><ChevronRight size={17} /></button></div>}
    </div>

    {visitors.isLoading ? <div className="admin-visitor-trend-loading" aria-label="Loading visitor graph"><i /><i /><i /></div>
      : visitors.isError ? <div className="admin-visitor-trend-error"><p>Visitor activity could not be loaded.</p><button type="button" onClick={() => void visitors.refetch()}>Try again</button></div>
      : !chartPoints.length ? <div className="admin-visitor-trend-empty"><TrendingUp size={25} /><strong>No visitor activity in this period</strong><p>Choose another date range to compare activity.</p></div>
      : <div className={`admin-visitor-trend${visitors.isFetching ? ' is-updating' : ''}`} onMouseLeave={() => setActiveIndex(Number.MAX_SAFE_INTEGER)}>
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} role="img" aria-label={`Daily website visitors for ${details.label}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id="visitor-area-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c99545" stopOpacity=".46" />
              <stop offset="70%" stopColor="#e8c783" stopOpacity=".13" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, .25, .5, .75, 1].map((ratio) => {
            const y = chartInset.top + plotHeight * ratio
            return <line className="admin-visitor-trend__grid" key={ratio} x1={chartInset.left} x2={chartWidth - chartInset.right} y1={y} y2={y} />
          })}
          <path className="admin-visitor-trend__area" d={areaPath} />
          <path className="admin-visitor-trend__line" d={linePath} />
          {activePoint && <line className="admin-visitor-trend__guide" x1={activePoint.x} x2={activePoint.x} y1={chartInset.top} y2={chartInset.top + plotHeight} />}
          {chartPoints.map((point, index) => {
            const hitWidth = plotWidth / Math.max(1, chartPoints.length)
            const hitX = Math.max(chartInset.left, point.x - hitWidth / 2)
            const fullLabel = `${formatDate(dateFromKey(point.date), { dateStyle: 'medium' })}: ${point.visitors} visitor${point.visitors === 1 ? '' : 's'}`
            return <g key={point.date} tabIndex={0} role="button" aria-label={fullLabel} onMouseEnter={() => setActiveIndex(index)} onFocus={() => setActiveIndex(index)} onClick={() => setActiveIndex(index)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') setActiveIndex(index) }}>
              <rect className="admin-visitor-trend__hit" x={hitX} y={chartInset.top} width={Math.min(hitWidth, chartWidth - chartInset.right - hitX)} height={plotHeight} />
            </g>
          })}
        </svg>
        <div className="admin-visitor-trend__scale" aria-hidden="true">{[0, .25, .5, .75, 1].map((ratio) => <span key={ratio} style={{ top: `${((chartInset.top + plotHeight * ratio) / chartHeight) * 100}%` }}>{Math.round(maximum * (1 - ratio))}</span>)}</div>
        <div className="admin-visitor-trend__dates" aria-hidden="true">{chartPoints.map((point, index) => axisLabel(point.date, index, chartPoints.length) ? <span key={point.date} style={{ left: `${(point.x / chartWidth) * 100}%` }}>{axisLabel(point.date, index, chartPoints.length)}</span> : null)}</div>
        {activePoint && <span className="admin-visitor-trend__active-dot" style={{ left: `${(activePoint.x / chartWidth) * 100}%`, top: `${(activePoint.y / chartHeight) * 100}%` }} aria-hidden="true" />}
        {activePoint && <div className={`admin-visitor-tooltip${resolvedActiveIndex === 0 ? ' is-left' : resolvedActiveIndex === chartPoints.length - 1 ? ' is-right' : ''}`} style={{ left: `${(activePoint.x / chartWidth) * 100}%`, top: `${(activePoint.y / chartHeight) * 100}%` }} aria-live="polite"><strong>{activePoint.visitors}</strong><span>{activePoint.visitors === 1 ? 'visitor' : 'visitors'}</span><small>{formatDate(dateFromKey(activePoint.date), { day: 'numeric', month: 'short', year: 'numeric' })}</small></div>}
      </div>}
  </section>
}
