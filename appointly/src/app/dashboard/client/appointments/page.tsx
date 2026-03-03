'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { AppointmentCard } from '@/components/dashboard/appointment-card'
import { Button } from '@/components/ui/button'
import { PageLoader } from '@/components/ui/spinner'
import type { Appointment } from '@/types'
import { Plus, CalendarDays } from 'lucide-react'

const STATUS_FILTERS = ['all', 'pending', 'confirmed', 'cancelled'] as const

export default function ClientAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<typeof STATUS_FILTERS[number]>('all')

  const fetchAppointments = useCallback(async () => {
    const res = await fetch('/api/appointments')
    const data = await res.json()
    setAppointments(data.data || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchAppointments() }, [fetchAppointments])

  async function handleStatusChange(id: string, status: 'confirmed' | 'cancelled') {
    await fetch(`/api/appointments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    fetchAppointments()
  }

  const filtered = appointments.filter(a => filter === 'all' || a.status === filter)

  return (
    <div>
      <Header
        title="My Appointments"
        actions={
          <Link href="/dashboard/client/book">
            <Button size="sm"><Plus size={14} /> Book</Button>
          </Link>
        }
      />

      <div className="p-8 space-y-6">
        {/* Filters */}
        <div className="flex items-center gap-2">
          {STATUS_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                filter === f
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <PageLoader />
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-slate-800 rounded-xl">
            <CalendarDays size={32} className="text-slate-700 mx-auto mb-3" />
            <p className="text-sm text-slate-500">No appointments found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(appt => (
              <AppointmentCard
                key={appt.id}
                appointment={appt}
                viewAs="client"
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
