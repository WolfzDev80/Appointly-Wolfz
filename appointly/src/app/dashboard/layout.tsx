export const dynamic = 'force-dynamic'
import { redirect } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { getCurrentUser } from '@/services/users'

export default async function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login')

  return <DashboardLayout user={user}>{children}</DashboardLayout>
}
