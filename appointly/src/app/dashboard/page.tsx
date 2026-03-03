import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/services/users'

export default async function DashboardPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login')
  redirect(`/dashboard/${user.role}`)
}
