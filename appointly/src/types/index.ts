export type UserRole = 'admin' | 'staff' | 'client'
export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled'

export interface User {
  id: string
  email: string
  role: UserRole
  full_name: string | null
  created_at: string
}

export interface Appointment {
  id: string
  client_id: string
  staff_id: string
  title: string
  description: string | null
  start_time: string
  end_time: string
  status: AppointmentStatus
  created_at: string
  client?: User
  staff?: User
}

export interface Analytics {
  total_users: number
  total_appointments: number
  pending_appointments: number
  confirmed_appointments: number
  cancelled_appointments: number
  bookings_by_day: { date: string; count: number }[]
}

export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  per_page: number
}
