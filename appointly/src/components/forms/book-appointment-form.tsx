'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import type { User } from '@/types'

interface BookAppointmentFormProps {
  staffMembers: User[]
  onSuccess?: () => void
}

export function BookAppointmentForm({ staffMembers, onSuccess }: BookAppointmentFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    title: '',
    description: '',
    staff_id: staffMembers[0]?.id || '',
    start_time: '',
    end_time: '',
  })

  const staffOptions = staffMembers.map(s => ({
    value: s.id,
    label: s.full_name || s.email,
  }))

  function onChange(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
    setError(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          start_time: new Date(form.start_time).toISOString(),
          end_time: new Date(form.end_time).toISOString(),
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to book appointment')
        return
      }

      router.push('/dashboard/client/appointments')
      router.refresh()
      onSuccess?.()
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="Title"
        placeholder="e.g. Initial consultation"
        value={form.title}
        onChange={e => onChange('title', e.target.value)}
        required
      />

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-300">Description</label>
        <textarea
          className="block w-full rounded-lg bg-slate-800/50 border border-slate-700 px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-150 resize-none"
          rows={3}
          placeholder="Optional details about your appointment..."
          value={form.description}
          onChange={e => onChange('description', e.target.value)}
        />
      </div>

      {staffOptions.length > 0 ? (
        <Select
          label="Staff Member"
          options={staffOptions}
          value={form.staff_id}
          onChange={e => onChange('staff_id', e.target.value)}
        />
      ) : (
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <p className="text-sm text-amber-400">No staff members available.</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Start Time"
          type="datetime-local"
          value={form.start_time}
          onChange={e => onChange('start_time', e.target.value)}
          required
        />
        <Input
          label="End Time"
          type="datetime-local"
          value={form.end_time}
          onChange={e => onChange('end_time', e.target.value)}
          required
        />
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <Button
        type="submit"
        loading={loading}
        disabled={!staffOptions.length}
        className="w-full"
      >
        Book Appointment
      </Button>
    </form>
  )
}
