'use client'

import { useState } from 'react'
import type { Appointment } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate, formatTime, getStatusColor } from '@/lib/utils'
import { Clock, User, ChevronDown, ChevronUp } from 'lucide-react'

interface AppointmentCardProps {
  appointment: Appointment
  viewAs: 'client' | 'staff' | 'admin'
  onStatusChange?: (id: string, status: 'confirmed' | 'cancelled') => Promise<void>
  onDelete?: (id: string) => Promise<void>
  onEdit?: (appointment: Appointment) => void
}

export function AppointmentCard({
  appointment,
  viewAs,
  onStatusChange,
  onDelete,
  onEdit,
}: AppointmentCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)

  async function handleAction(action: () => Promise<void>, key: string) {
    setLoading(key)
    try { await action() } finally { setLoading(null) }
  }

  const person = viewAs === 'client' ? appointment.staff : appointment.client

  return (
    <div className="border border-slate-800 rounded-xl bg-slate-900/30 hover:border-slate-700 transition-all duration-150 animate-slide-up">
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-semibold text-white truncate">{appointment.title}</h3>
              <Badge className={getStatusColor(appointment.status)}>
                {appointment.status}
              </Badge>
            </div>
            <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Clock size={12} />
                {formatDate(appointment.start_time)} – {formatTime(appointment.end_time)}
              </span>
              {person && (
                <span className="flex items-center gap-1.5">
                  <User size={12} />
                  {person.full_name || person.email}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => setExpanded(e => !e)}
            className="p-1 text-slate-500 hover:text-slate-300 transition-colors shrink-0"
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        {expanded && (
          <div className="mt-3 pt-3 border-t border-slate-800 space-y-3 animate-fade-in">
            {appointment.description && (
              <p className="text-sm text-slate-400">{appointment.description}</p>
            )}

            <div className="flex items-center gap-2 flex-wrap">
              {viewAs === 'client' && appointment.status !== 'cancelled' && (
                <>
                  {onEdit && (
                    <Button size="sm" variant="outline" onClick={() => onEdit(appointment)}>
                      Edit
                    </Button>
                  )}
                  {onStatusChange && (
                    <Button
                      size="sm"
                      variant="danger"
                      loading={loading === 'cancel'}
                      onClick={() => handleAction(() => onStatusChange(appointment.id, 'cancelled'), 'cancel')}
                    >
                      Cancel
                    </Button>
                  )}
                </>
              )}

              {viewAs === 'staff' && appointment.status === 'pending' && onStatusChange && (
                <>
                  <Button
                    size="sm"
                    variant="primary"
                    loading={loading === 'confirm'}
                    onClick={() => handleAction(() => onStatusChange(appointment.id, 'confirmed'), 'confirm')}
                  >
                    Confirm
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    loading={loading === 'cancel'}
                    onClick={() => handleAction(() => onStatusChange(appointment.id, 'cancelled'), 'cancel')}
                  >
                    Decline
                  </Button>
                </>
              )}

              {viewAs === 'admin' && onDelete && (
                <Button
                  size="sm"
                  variant="danger"
                  loading={loading === 'delete'}
                  onClick={() => handleAction(() => onDelete(appointment.id), 'delete')}
                >
                  Delete
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
