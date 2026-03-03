import { createClient, createAdminClient } from '@/lib/supabase/server'
import type { User, UserRole } from '@/types'

export async function getCurrentUser(): Promise<User | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  return data
}

export async function getAllUsers(): Promise<User[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data || []
}

export async function getUsersByRole(role: UserRole): Promise<User[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('role', role)
    .order('full_name', { ascending: true })

  if (error) throw new Error(error.message)
  return data || []
}

export async function updateUserRole(userId: string, role: UserRole): Promise<User> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('users')
    .update({ role })
    .eq('id', userId)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function deleteUser(userId: string): Promise<void> {
  const adminClient = createAdminClient()
  // Delete auth user (cascades to public.users via trigger)
  const { error } = await adminClient.auth.admin.deleteUser(userId)
  if (error) throw new Error(error.message)
}

export async function getAnalytics() {
  const supabase = createClient()

  const [usersResult, appointmentsResult] = await Promise.all([
    supabase.from('users').select('id, created_at, role'),
    supabase.from('appointments').select('id, status, created_at'),
  ])

  const users = usersResult.data || []
  const appointments = appointmentsResult.data || []

  // Bookings per day (last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const bookingsByDay = appointments
    .filter(a => new Date(a.created_at) >= thirtyDaysAgo)
    .reduce((acc: Record<string, number>, a) => {
      const date = a.created_at.split('T')[0]
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {})

  return {
    total_users: users.length,
    total_appointments: appointments.length,
    pending_appointments: appointments.filter(a => a.status === 'pending').length,
    confirmed_appointments: appointments.filter(a => a.status === 'confirmed').length,
    cancelled_appointments: appointments.filter(a => a.status === 'cancelled').length,
    bookings_by_day: Object.entries(bookingsByDay)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date)),
  }
}
