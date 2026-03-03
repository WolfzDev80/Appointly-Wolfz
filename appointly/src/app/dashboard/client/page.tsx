import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser } from '@/services/users'
import { getAppointmentsByClient } from '@/services/appointments'
import { Header } from '@/components/layout/header'
import { StatsCard } from '@/components/ui/stats-card'
import { AppointmentCard } from '@/components/dashboard/appointment-card'
import { Button } from '@/components/ui/button'
import { CalendarDays, Clock, CheckCircle, XCircle, Plus } from 'lucide-react'

export default async function ClientDashboard() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'client') redirect('/auth/login')

  const appointments = await getAppointmentsByClient(user.id)
  const upcoming = appointments.filter(a => 
    a.status !== 'cancelled' && new Date(a.start_time) > new Date()
  ).slice(0, 5)

  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
  }

  return (
    <div>
      <Header
        title="My Dashboard"
        subtitle={`Welcome back, ${user.full_name?.split(' ')[0] || 'there'}`}
        actions={
          <Link href="/dashboard/client/book">
            <Button size="sm">
              <Plus size={14} />
              Book appointment
            </Button>
          </Link>
        }
      />

      <div className="p-8 space-y-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total" value={stats.total} icon={<CalendarDays size={18} />} />
          <StatsCard title="Pending" value={stats.pending} icon={<Clock size={18} />} />
          <StatsCard title="Confirmed" value={stats.confirmed} icon={<CheckCircle size={18} />} />
          <StatsCard title="Cancelled" value={stats.cancelled} icon={<XCircle size={18} />} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-200">Upcoming Appointments</h2>
            <Link href="/dashboard/client/appointments" className="text-xs text-indigo-400 hover:text-indigo-300">
              View all →
            </Link>
          </div>

          {upcoming.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-slate-800 rounded-xl">
              <CalendarDays size={32} className="text-slate-700 mx-auto mb-3" />
              <p className="text-sm text-slate-500">No upcoming appointments</p>
              <Link href="/dashboard/client/book">
                <Button size="sm" variant="outline" className="mt-4">
                  Book your first appointment
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.map(appt => (
                <AppointmentCard
                  key={appt.id}
                  appointment={appt}
                  viewAs="client"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
