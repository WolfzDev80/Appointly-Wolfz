import { redirect } from 'next/navigation'
import { getCurrentUser, getUsersByRole } from '@/services/users'
import { Header } from '@/components/layout/header'
import { BookAppointmentForm } from '@/components/forms/book-appointment-form'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default async function BookAppointmentPage() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'client') redirect('/auth/login')

  const staffMembers = await getUsersByRole('staff')

  return (
    <div>
      <Header title="Book Appointment" subtitle="Schedule time with a staff member" />
      <div className="p-8 max-w-2xl">
        <Card>
          <CardHeader>
            <h2 className="text-sm font-semibold text-slate-200">Appointment Details</h2>
            <p className="text-xs text-slate-500 mt-0.5">Fill in the details to request an appointment</p>
          </CardHeader>
          <CardContent>
            <BookAppointmentForm staffMembers={staffMembers} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
