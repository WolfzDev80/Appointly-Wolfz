import { redirect } from 'next/navigation'
import { getCurrentUser, getAnalytics } from '@/services/users'
import { Header } from '@/components/layout/header'
import { StatsCard } from '@/components/ui/stats-card'
import { Users, CalendarDays, Clock, CheckCircle, XCircle, BarChart3 } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'admin') redirect('/auth/login')

  const analytics = await getAnalytics()

  return (
    <div>
      <Header title="Admin Overview" subtitle="System-wide statistics and management" />

      <div className="p-8 space-y-8">
        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <StatsCard title="Total Users" value={analytics.total_users} icon={<Users size={18} />} />
          <StatsCard title="Total Bookings" value={analytics.total_appointments} icon={<CalendarDays size={18} />} />
          <StatsCard title="Pending" value={analytics.pending_appointments} icon={<Clock size={18} />} />
          <StatsCard title="Confirmed" value={analytics.confirmed_appointments} icon={<CheckCircle size={18} />} />
          <StatsCard title="Cancelled" value={analytics.cancelled_appointments} icon={<XCircle size={18} />} />
          <StatsCard
            title="Completion Rate"
            value={analytics.total_appointments > 0
              ? `${Math.round((analytics.confirmed_appointments / analytics.total_appointments) * 100)}%`
              : '—'
            }
            icon={<BarChart3 size={18} />}
          />
        </div>

        {/* Quick actions */}
        <div>
          <h2 className="text-sm font-semibold text-slate-200 mb-4">Quick Access</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { href: '/dashboard/admin/users', label: 'Manage Users', desc: 'View, edit roles, and delete users', icon: <Users size={20} /> },
              { href: '/dashboard/admin/appointments', label: 'All Appointments', desc: 'View and manage every appointment', icon: <CalendarDays size={20} /> },
              { href: '/dashboard/admin/analytics', label: 'Analytics', desc: 'Detailed booking trends and charts', icon: <BarChart3 size={20} /> },
            ].map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="p-5 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all duration-150 group"
              >
                <div className="text-indigo-400 mb-3">{item.icon}</div>
                <h3 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">{item.label}</h3>
                <p className="mt-1 text-xs text-slate-500">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent bookings by day */}
        {analytics.bookings_by_day.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-slate-200 mb-4">Bookings — Last 30 Days</h2>
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
              <div className="flex items-end gap-1 h-24">
                {analytics.bookings_by_day.slice(-14).map(item => {
                  const max = Math.max(...analytics.bookings_by_day.map(d => d.count))
                  const height = max > 0 ? (item.count / max) * 100 : 0
                  return (
                    <div key={item.date} className="flex-1 flex flex-col items-center gap-1 group">
                      <span className="text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.count}
                      </span>
                      <div
                        className="w-full bg-indigo-600/50 group-hover:bg-indigo-500 rounded-sm transition-colors"
                        style={{ height: `${Math.max(height, 4)}%` }}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
