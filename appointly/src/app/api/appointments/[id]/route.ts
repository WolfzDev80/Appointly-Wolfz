export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import { updateAppointmentSchema } from '@/lib/validations'
import { getAppointmentById, updateAppointment, deleteAppointment } from '@/services/appointments'
import { getCurrentUser } from '@/services/users'
import { createApiError, createApiSuccess } from '@/lib/utils'

interface Params {
  params: { id: string }
}

export async function GET(_: NextRequest, { params }: Params) {
  try {
    const user = await getCurrentUser()
    if (!user) return createApiError('Unauthorized', 401)

    const appointment = await getAppointmentById(params.id)
    if (!appointment) return createApiError('Appointment not found', 404)

    const canView =
      user.role === 'admin' ||
      appointment.client_id === user.id ||
      appointment.staff_id === user.id

    if (!canView) return createApiError('Forbidden', 403)

    return createApiSuccess(appointment)
  } catch (error) {
    console.error('[GET /api/appointments/:id]', error)
    return createApiError('Internal server error', 500)
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const user = await getCurrentUser()
    if (!user) return createApiError('Unauthorized', 401)

    const appointment = await getAppointmentById(params.id)
    if (!appointment) return createApiError('Appointment not found', 404)

    const body = await request.json()
    const result = updateAppointmentSchema.safeParse(body)

    if (!result.success) {
      return createApiError(result.error.issues[0].message, 422)
    }

    // Role-based update restrictions
    if (user.role === 'client') {
      if (appointment.client_id !== user.id) return createApiError('Forbidden', 403)
      if (result.data.status && result.data.status !== 'cancelled') {
        return createApiError('Clients can only cancel appointments', 403)
      }
    }

    if (user.role === 'staff') {
      if (appointment.staff_id !== user.id) return createApiError('Forbidden', 403)
      // Staff can only update status
      const { status } = result.data
      if (Object.keys(result.data).some(k => k !== 'status')) {
        return createApiError('Staff can only update appointment status', 403)
      }
    }

    const updated = await updateAppointment(params.id, result.data)
    return createApiSuccess(updated)
  } catch (error) {
    console.error('[PATCH /api/appointments/:id]', error)
    return createApiError('Internal server error', 500)
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    const user = await getCurrentUser()
    if (!user) return createApiError('Unauthorized', 401)

    const appointment = await getAppointmentById(params.id)
    if (!appointment) return createApiError('Appointment not found', 404)

    const canDelete =
      user.role === 'admin' ||
      (user.role === 'client' && appointment.client_id === user.id)

    if (!canDelete) return createApiError('Forbidden', 403)

    await deleteAppointment(params.id)
    return createApiSuccess({ message: 'Appointment deleted' })
  } catch (error) {
    console.error('[DELETE /api/appointments/:id]', error)
    return createApiError('Internal server error', 500)
  }
}
