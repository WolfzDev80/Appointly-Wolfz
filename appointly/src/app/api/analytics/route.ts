export const dynamic = 'force-dynamic'
import { getCurrentUser, getAnalytics } from '@/services/users'
import { createApiError, createApiSuccess } from '@/lib/utils'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return createApiError('Unauthorized', 401)
    if (user.role !== 'admin') return createApiError('Forbidden', 403)

    const analytics = await getAnalytics()
    return createApiSuccess(analytics)
  } catch (error) {
    console.error('[GET /api/analytics]', error)
    return createApiError('Internal server error', 500)
  }
}
