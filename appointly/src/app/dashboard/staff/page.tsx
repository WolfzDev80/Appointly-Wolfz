import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/services/users'
import { getAppointmentsByStaff } from '@/services/appointments'
import { Header } from '@/components/layout/header'
import { StatsCard } from '@/components/ui/stats-card'
import { AppointmentCard } from '@/components/dashboard/appointment-card'
import { CalendarDays, Clock, CheckCircle, User } from 'lucide-react'
import Link from 'next/link'

export default async function StaffDashboard() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'staff') redirect('/auth/login')

  const appointments = await getAppointmentsByStaff(user.id)
  const today = new Date().toISOString().split('T')[0]
  const todayAppts = await getAppointmentsByStaff(user.id, today)

  const stats = {
    total: appointments.length,
    today: todayAppts.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
  }

  const upcoming = appointments
    .filter(a => a.status !== 'cancelled' && new Date(a.start_time) > new Date())
    .slice(0, 5)

  return (
    <div>
      <Header
        title="Staff Dashboard"
        subtitle={`Welcome, ${user.full_name?.split(' ')[0] || 'there'}`}
      />

      <div className="p-8 space-y-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total" value={stats.total} icon={<CalendarDays size={18} />} />
          <StatsCard title="Today" value={stats.today} icon={<Clock size={18} />} />
          <StatsCard title="Pending" value={stats.pending} icon={<User size={18} />} />
          <StatsCard title="Confirmed" value={stats.confirmed} icon={<CheckCircle size={18} />} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-200">Upcoming Appointments</h2>
            <Link href="/dashboard/staff/appointments" className="text-xs text-indigo-400 hover:text-indigo-300">
              View all →
            </Link>
          </div>

          {upcoming.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-slate-800 rounded-xl">
              <CalendarDays size={32} className="text-slate-700 mx-auto mb-3" />
              <p className="text-sm text-slate-500">No upcoming appointments</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.map(appt => (
                <AppointmentCard key={appt.id} appointment={appt} viewAs="staff" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
