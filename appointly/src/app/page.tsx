export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { CalendarDays, Shield, Users, Zap } from 'lucide-react'

export default function HomePage() {
  const features = [
    { icon: <CalendarDays size={20} />, title: 'Smart Scheduling', desc: 'Effortlessly manage appointments with real-time availability.' },
    { icon: <Users size={20} />, title: 'Role-Based Access', desc: 'Dedicated dashboards for admins, staff, and clients.' },
    { icon: <Shield size={20} />, title: 'Enterprise Security', desc: 'Row-level security and JWT authentication via Supabase.' },
    { icon: <Zap size={20} />, title: 'Instant Updates', desc: 'Live status changes with seamless server-client sync.' },
  ]

  const demoAccounts = [
    { role: 'Admin', email: 'admin@appointly.dev', password: 'Admin1234!', color: 'violet' },
    { role: 'Staff', email: 'staff@appointly.dev', password: 'Staff1234!', color: 'sky' },
    { role: 'Client', email: 'client@appointly.dev', password: 'Client1234!', color: 'slate' },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Nav */}
      <nav className="border-b border-slate-800/60 px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <CalendarDays size={14} className="text-white" />
            </div>
            <span className="text-base font-semibold tracking-tight">Appointly</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm text-slate-400 hover:text-white transition-colors px-4 py-2">
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-8 py-24">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs text-indigo-400 mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
            Full-stack SaaS • Next.js 14 + Supabase
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-white tracking-tight text-balance leading-tight">
            Appointment management<br />
            <span className="text-indigo-400">built for modern teams</span>
          </h1>
          <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto text-balance">
            A production-ready scheduling platform with role-based dashboards, real-time updates, and enterprise-grade security.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/auth/signup"
              className="w-full sm:w-auto font-medium bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-lg transition-colors text-sm"
            >
              Start for free
            </Link>
            <Link
              href="/auth/login"
              className="w-full sm:w-auto font-medium border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white px-8 py-3 rounded-lg transition-colors text-sm"
            >
              View demo
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map(f => (
              <div key={f.title} className="p-5 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors">
                <div className="p-2 bg-indigo-500/10 rounded-lg w-fit text-indigo-400 mb-3">{f.icon}</div>
                <h3 className="text-sm font-semibold text-white">{f.title}</h3>
                <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo accounts */}
      <section className="px-8 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold text-white text-center mb-8">Demo Accounts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {demoAccounts.map(account => (
              <div key={account.role} className="p-5 bg-slate-900/50 border border-slate-800 rounded-xl">
                <div className={`inline-flex px-2 py-0.5 rounded text-xs font-medium mb-3 ${
                  account.color === 'violet' ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20' :
                  account.color === 'sky' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' :
                  'bg-slate-700/50 text-slate-400 border border-slate-600/30'
                }`}>
                  {account.role}
                </div>
                <p className="text-xs text-slate-300 font-mono">{account.email}</p>
                <p className="mt-1 text-xs text-slate-500 font-mono">{account.password}</p>
                <Link
                  href={`/auth/login?email=${encodeURIComponent(account.email)}`}
                  className="mt-3 block text-center text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Login as {account.role} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 px-8 py-8 text-center">
        <p className="text-xs text-slate-600">
          Built with Next.js 14, Supabase, and Tailwind CSS. Deployed on Vercel.
        </p>
      </footer>
    </div>
  )
}
