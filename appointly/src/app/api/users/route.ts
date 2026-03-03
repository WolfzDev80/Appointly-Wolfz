import { NextRequest } from 'next/server'
import { getAllUsers, getCurrentUser } from '@/services/users'
import { createApiError, createApiSuccess } from '@/lib/utils'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return createApiError('Unauthorized', 401)
    if (user.role !== 'admin') return createApiError('Forbidden', 403)

    const users = await getAllUsers()
    return createApiSuccess(users)
  } catch (error) {
    console.error('[GET /api/users]', error)
    return createApiError('Internal server error', 500)
  }
}
