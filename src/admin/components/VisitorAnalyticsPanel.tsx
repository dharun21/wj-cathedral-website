import { useQuery } from '@tanstack/react-query'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import { fetchOwnerVisitorTrend } from '../../services/analyticsService'
import { indiaDateKey } from '../../utils/indiaDate'

type VisitorRange = 'today' | 'yesterday' | 'week' | 'thirty-days' | 'month'

const rangeOptions: Array<{ value: VisitorRange; label: string }> = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'week', label: '7 days' },
  { value: 'thirty-days', label: '30 days' },
  { value: 'month', label: 'Month' },
]

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

function barLabel(date: string, index: number, length: number) {
  const value = dateFromKey(date)
  if (length === 1) return formatDate(value, { day: 'numeric', month: 'short' })
  if (length <= 7) return formatDate(value, { weekday: 'short' })
  if (index === 0 || index === length - 1 || index % 5 === 0) return formatDate(value, { day: 'numeric', month: 'short' })
  return ''
}

export function VisitorAnalyticsPanel() {
  const [range, setRange] = useState<VisitorRange>('week')
  const currentMonth = useMemo(() => monthStart(dateFromKey(indiaDateKey())), [])
  const [selectedMonth, setSelectedMonth] = useState(currentMonth)
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
  const maximum = Math.max(1, ...points.map((point) => point.visitors))
  const isCurrentMonth = dateKey(selectedMonth) === dateKey(currentMonth)
  const changeMonth = (amount: number) => setSelectedMonth(new Date(Date.UTC(selectedMonth.getUTCFullYear(), selectedMonth.getUTCMonth() + amount, 1)))

  return <section className="admin-visitor-summary">
    <header><div><p>Website visitors</p><h2>Visitor activity</h2></div><small>India Standard Time</small></header>
    <div className="admin-visitor-range" role="group" aria-label="Visitor graph date range">
      {rangeOptions.map((option) => <button type="button" className={range === option.value ? 'is-active' : ''} key={option.value} onClick={() => setRange(option.value)}>{option.label}</button>)}
    </div>
    <div className="admin-visitor-chart__heading">
      <div><CalendarDays size={17} /><strong>{details.label}</strong></div>
      {range === 'month' && <div className="admin-visitor-month-nav"><button type="button" onClick={() => changeMonth(-1)} aria-label="Previous month"><ChevronLeft size={17} /></button><button type="button" disabled={isCurrentMonth} onClick={() => changeMonth(1)} aria-label="Next month"><ChevronRight size={17} /></button></div>}
    </div>
    {visitors.isLoading ? <div className="admin-visitor-chart__loading" aria-label="Loading visitor graph"><i /><i /><i /><i /><i /><i /><i /></div>
      : visitors.isError ? <div className="admin-visitor-chart__error"><p>Visitor activity could not be loaded.</p><button type="button" onClick={() => void visitors.refetch()}>Try again</button></div>
      : <div className="admin-visitor-chart" role="img" aria-label={`Daily website visitors for ${details.label}`}>
        <div className="admin-visitor-chart__scale" aria-hidden="true"><span>{maximum}</span><span>{Math.round(maximum / 2)}</span><span>0</span></div>
        <div className="admin-visitor-chart__bars">{points.map((point, index) => {
          const height = point.visitors === 0 ? 3 : Math.max(8, Math.round((point.visitors / maximum) * 100))
          const fullLabel = `${formatDate(dateFromKey(point.date), { dateStyle: 'medium' })}: ${point.visitors} visitor${point.visitors === 1 ? '' : 's'}`
          return <div className="admin-visitor-chart__bar" key={point.date} tabIndex={0} aria-label={fullLabel} title={fullLabel}><span><i style={{ height: `${height}%` }} /></span><small>{barLabel(point.date, index, points.length)}</small></div>
        })}</div>
      </div>}
  </section>
}
