import { redirect } from 'next/navigation'
import { getCurrentUser, getAnalytics } from '@/services/users'
import { Header } from '@/components/layout/header'
import { StatsCard } from '@/components/ui/stats-card'
import { Users, CalendarDays, Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-react'

export default async function AdminAnalyticsPage() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'admin') redirect('/auth/login')

  const analytics = await getAnalytics()
  const confirmRate = analytics.total_appointments > 0
    ? Math.round((analytics.confirmed_appointments / analytics.total_appointments) * 100)
    : 0

  const maxCount = Math.max(...analytics.bookings_by_day.map(d => d.count), 1)

  return (
    <div>
      <Header title="Analytics" subtitle="Booking trends and system metrics" />

      <div className="p-8 space-y-8">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <StatsCard title="Total Users" value={analytics.total_users} icon={<Users size={18} />} />
          <StatsCard title="All Bookings" value={analytics.total_appointments} icon={<CalendarDays size={18} />} />
          <StatsCard title="Pending" value={analytics.pending_appointments} icon={<Clock size={18} />} />
          <StatsCard title="Confirmed" value={analytics.confirmed_appointments} icon={<CheckCircle size={18} />} />
          <StatsCard title="Cancelled" value={analytics.cancelled_appointments} icon={<XCircle size={18} />} />
          <StatsCard title="Confirmation Rate" value={`${confirmRate}%`} icon={<TrendingUp size={18} />} />
        </div>

        {/* Bookings chart */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-slate-200 mb-6">Daily Bookings — Last 30 Days</h3>
          {analytics.bookings_by_day.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">No booking data yet</p>
          ) : (
            <div className="space-y-3">
              {analytics.bookings_by_day.slice(-14).map(item => (
                <div key={item.date} className="flex items-center gap-4">
                  <span className="text-xs text-slate-500 font-mono w-24 shrink-0">{item.date}</span>
                  <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all"
                      style={{ width: `${(item.count / maxCount) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-400 w-6 text-right font-mono">{item.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status breakdown */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-slate-200 mb-6">Appointment Status Breakdown</h3>
          <div className="space-y-3">
            {[
              { label: 'Confirmed', count: analytics.confirmed_appointments, color: 'bg-emerald-500' },
              { label: 'Pending', count: analytics.pending_appointments, color: 'bg-amber-500' },
              { label: 'Cancelled', count: analytics.cancelled_appointments, color: 'bg-red-500' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-4">
                <span className="text-xs text-slate-500 w-20 shrink-0">{item.label}</span>
                <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all`}
                    style={{ width: analytics.total_appointments > 0 ? `${(item.count / analytics.total_appointments) * 100}%` : '0%' }}
                  />
                </div>
                <span className="text-xs text-slate-400 w-10 text-right font-mono">
                  {analytics.total_appointments > 0
                    ? `${Math.round((item.count / analytics.total_appointments) * 100)}%`
                    : '0%'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
