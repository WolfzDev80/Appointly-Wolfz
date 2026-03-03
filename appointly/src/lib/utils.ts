import { clsx, type ClassValue } from 'clsx'
import { format, parseISO, isToday, isTomorrow, isPast } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatDate(dateString: string): string {
  const date = parseISO(dateString)
  if (isToday(date)) return `Today, ${format(date, 'h:mm a')}`
  if (isTomorrow(date)) return `Tomorrow, ${format(date, 'h:mm a')}`
  return format(date, 'MMM d, yyyy • h:mm a')
}

export function formatDateShort(dateString: string): string {
  return format(parseISO(dateString), 'MMM d, yyyy')
}

export function formatTime(dateString: string): string {
  return format(parseISO(dateString), 'h:mm a')
}

export function isAppointmentPast(endTime: string): boolean {
  return isPast(parseISO(endTime))
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'confirmed': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
    case 'pending': return 'text-amber-400 bg-amber-400/10 border-amber-400/20'
    case 'cancelled': return 'text-red-400 bg-red-400/10 border-red-400/20'
    default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20'
  }
}

export function getRoleColor(role: string): string {
  switch (role) {
    case 'admin': return 'text-violet-400 bg-violet-400/10 border-violet-400/20'
    case 'staff': return 'text-sky-400 bg-sky-400/10 border-sky-400/20'
    case 'client': return 'text-slate-400 bg-slate-400/10 border-slate-400/20'
    default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20'
  }
}

export function createApiError(message: string, status: number = 400) {
  return Response.json({ error: message }, { status })
}

export function createApiSuccess<T>(data: T, status: number = 200) {
  return Response.json({ data }, { status })
}
