'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { User } from '@/types'
import {
  CalendarDays,
  LayoutDashboard,
  Users,
  BarChart3,
  LogOut,
  Clock,
  Settings,
  ChevronRight,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
}

const navByRole: Record<string, NavItem[]> = {
  admin: [
    { href: '/dashboard/admin', label: 'Overview', icon: <LayoutDashboard size={16} /> },
    { href: '/dashboard/admin/users', label: 'Users', icon: <Users size={16} /> },
    { href: '/dashboard/admin/appointments', label: 'Appointments', icon: <CalendarDays size={16} /> },
    { href: '/dashboard/admin/analytics', label: 'Analytics', icon: <BarChart3 size={16} /> },
  ],
  staff: [
    { href: '/dashboard/staff', label: 'Overview', icon: <LayoutDashboard size={16} /> },
    { href: '/dashboard/staff/appointments', label: 'Appointments', icon: <CalendarDays size={16} /> },
    { href: '/dashboard/staff/schedule', label: 'Schedule', icon: <Clock size={16} /> },
  ],
  client: [
    { href: '/dashboard/client', label: 'Overview', icon: <LayoutDashboard size={16} /> },
    { href: '/dashboard/client/appointments', label: 'My Appointments', icon: <CalendarDays size={16} /> },
    { href: '/dashboard/client/book', label: 'Book Appointment', icon: <Clock size={16} /> },
  ],
}

interface SidebarProps {
  user: User
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const navItems = navByRole[user.role] || []

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  const roleLabel = { admin: 'Administrator', staff: 'Staff Member', client: 'Client' }

  return (
    <aside className="w-60 shrink-0 bg-slate-950 border-r border-slate-800/60 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-800/60">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center">
            <CalendarDays size={14} className="text-white" />
          </div>
          <span className="text-base font-semibold text-white tracking-tight">Appointly</span>
        </div>
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-xs font-semibold">
            {user.full_name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">
              {user.full_name || user.email.split('@')[0]}
            </p>
            <p className="text-xs text-slate-500">{roleLabel[user.role]}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(item => {
          const isActive = pathname === item.href || 
            (item.href !== `/dashboard/${user.role}` && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 group',
                isActive
                  ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              )}
            >
              <span className={cn(isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300')}>
                {item.icon}
              </span>
              {item.label}
              {isActive && <ChevronRight size={12} className="ml-auto text-indigo-500" />}
            </Link>
          )
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-4 border-t border-slate-800/60 space-y-0.5">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-all duration-150"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
