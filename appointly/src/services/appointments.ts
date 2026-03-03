import { createClient } from '@/lib/supabase/server'
import type { Appointment, AppointmentStatus } from '@/types'

export async function getAppointmentsByClient(clientId: string): Promise<Appointment[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('appointments')
    .select(`
      *,
      staff:users!appointments_staff_id_fkey(id, email, full_name, role)
    `)
    .eq('client_id', clientId)
    .order('start_time', { ascending: false })

  if (error) throw new Error(error.message)
  return data || []
}

export async function getAppointmentsByStaff(staffId: string, date?: string): Promise<Appointment[]> {
  const supabase = createClient()
  let query = supabase
    .from('appointments')
    .select(`
      *,
      client:users!appointments_client_id_fkey(id, email, full_name, role)
    `)
    .eq('staff_id', staffId)
    .order('start_time', { ascending: true })

  if (date) {
    const start = new Date(date)
    start.setHours(0, 0, 0, 0)
    const end = new Date(date)
    end.setHours(23, 59, 59, 999)
    query = query
      .gte('start_time', start.toISOString())
      .lte('start_time', end.toISOString())
  }

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return data || []
}

export async function getAllAppointments(): Promise<Appointment[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('appointments')
    .select(`
      *,
      client:users!appointments_client_id_fkey(id, email, full_name, role),
      staff:users!appointments_staff_id_fkey(id, email, full_name, role)
    `)
    .order('start_time', { ascending: false })

  if (error) throw new Error(error.message)
  return data || []
}

export async function getAppointmentById(id: string): Promise<Appointment | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('appointments')
    .select(`
      *,
      client:users!appointments_client_id_fkey(id, email, full_name, role),
      staff:users!appointments_staff_id_fkey(id, email, full_name, role)
    `)
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

export async function createAppointment(payload: {
  client_id: string
  staff_id: string
  title: string
  description?: string
  start_time: string
  end_time: string
}): Promise<Appointment> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('appointments')
    .insert({ ...payload, status: 'pending' })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function updateAppointment(
  id: string,
  updates: Partial<Appointment>
): Promise<Appointment> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('appointments')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus
): Promise<Appointment> {
  return updateAppointment(id, { status })
}

export async function deleteAppointment(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('appointments').delete().eq('id', id)
  if (error) throw new Error(error.message)
}
