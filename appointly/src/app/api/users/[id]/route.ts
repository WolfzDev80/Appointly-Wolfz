import { NextRequest } from 'next/server'
import { updateUserRoleSchema } from '@/lib/validations'
import { getCurrentUser, updateUserRole, deleteUser } from '@/services/users'
import { createApiError, createApiSuccess } from '@/lib/utils'

interface Params {
  params: { id: string }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const user = await getCurrentUser()
    if (!user) return createApiError('Unauthorized', 401)
    if (user.role !== 'admin') return createApiError('Forbidden', 403)
    if (user.id === params.id) return createApiError('Cannot change your own role', 400)

    const body = await request.json()
    const result = updateUserRoleSchema.safeParse(body)

    if (!result.success) {
      return createApiError(result.error.issues[0].message, 422)
    }

    const updated = await updateUserRole(params.id, result.data.role)
    return createApiSuccess(updated)
  } catch (error) {
    console.error('[PATCH /api/users/:id]', error)
    return createApiError('Internal server error', 500)
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    const user = await getCurrentUser()
    if (!user) return createApiError('Unauthorized', 401)
    if (user.role !== 'admin') return createApiError('Forbidden', 403)
    if (user.id === params.id) return createApiError('Cannot delete your own account', 400)

    await deleteUser(params.id)
    return createApiSuccess({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('[DELETE /api/users/:id]', error)
    return createApiError('Internal server error', 500)
  }
}
