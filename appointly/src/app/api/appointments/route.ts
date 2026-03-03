import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { appointmentSchema } from '@/lib/validations'
import { createAppointment, getAllAppointments, getAppointmentsByClient, getAppointmentsByStaff } from '@/services/appointments'
import { getCurrentUser } from '@/services/users'
import { createApiError, createApiSuccess } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) return createApiError('Unauthorized', 401)

    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date') || undefined

    let appointments
    if (user.role === 'admin') {
      appointments = await getAllAppointments()
    } else if (user.role === 'staff') {
      appointments = await getAppointmentsByStaff(user.id, date)
    } else {
      appointments = await getAppointmentsByClient(user.id)
    }

    return createApiSuccess(appointments)
  } catch (error) {
    console.error('[GET /api/appointments]', error)
    return createApiError('Internal server error', 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) return createApiError('Unauthorized', 401)
    if (user.role !== 'client') return createApiError('Only clients can book appointments', 403)

    const body = await request.json()
    const result = appointmentSchema.safeParse(body)

    if (!result.success) {
      return createApiError(result.error.issues[0].message, 422)
    }

    const appointment = await createAppointment({
      client_id: user.id,
      staff_id: result.data.staff_id,
      title: result.data.title,
      description: result.data.description,
      start_time: result.data.start_time,
      end_time: result.data.end_time,
    })

    return createApiSuccess(appointment, 201)
  } catch (error) {
    console.error('[POST /api/appointments]', error)
    return createApiError('Internal server error', 500)
  }
}
