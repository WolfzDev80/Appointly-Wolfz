'use client'

import { useState, useEffect, useCallback } from 'react'
import { Header } from '@/components/layout/header'
import { AppointmentCard } from '@/components/dashboard/appointment-card'
import { Input } from '@/components/ui/input'
import { PageLoader } from '@/components/ui/spinner'
import type { Appointment } from '@/types'
import { CalendarDays } from 'lucide-react'

export default function StaffAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [date, setDate] = useState('')

  const fetchAppointments = useCallback(async () => {
    setLoading(true)
    const url = date ? `/api/appointments?date=${date}` : '/api/appointments'
    const res = await fetch(url)
    const data = await res.json()
    setAppointments(data.data || [])
    setLoading(false)
  }, [date])

  useEffect(() => { fetchAppointments() }, [fetchAppointments])

  async function handleStatusChange(id: string, status: 'confirmed' | 'cancelled') {
    await fetch(`/api/appointments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    fetchAppointments()
  }

  return (
    <div>
      <Header
        title="Appointments"
        subtitle="Manage your assigned appointments"
      />

      <div className="p-8 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-48">
            <Input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              placeholder="Filter by date"
            />
          </div>
          {date && (
            <button
              onClick={() => setDate('')}
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              Clear filter
            </button>
          )}
        </div>

        {loading ? (
          <PageLoader />
        ) : appointments.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-slate-800 rounded-xl">
            <CalendarDays size={32} className="text-slate-700 mx-auto mb-3" />
            <p className="text-sm text-slate-500">
              {date ? 'No appointments on this date' : 'No appointments assigned yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map(appt => (
              <AppointmentCard
                key={appt.id}
                appointment={appt}
                viewAs="staff"
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
